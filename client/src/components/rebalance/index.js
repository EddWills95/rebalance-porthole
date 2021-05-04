import { Button, InputNumber, message as AntMessage } from 'antd';
import { useContext, useEffect, useState } from "react";
import { Channel } from "..";
import { useSocket } from "../../hooks";
import { FETCH_CHANNELS, SET_CHANNEL } from "../../store/actions";
import { store } from "../../store/store";
import { sleep } from "../../utils";

import "./style.scss";

const Rebalance = ({ channel, onSelect, onRebalance = () => { } }) => {
    const [rebalancing, setRebalancing] = useState(false);
    const [amount, setAmount] = useState(channel.amountFor5050);
    const [success, setSuccess] = useState(false);
    const [messages, setMessages] = useState([]);
    const { dispatch } = useContext(store);

    const { socket } = useSocket('rebalance', () => setRebalancing(false));

    useEffect(() => {
        if (success) {
            setTimeout(() => { setSuccess(false) }, 4000);
        }
    }, [success]);

    const scrollDown = () => {
        var elem = document.querySelector('.messages');
        elem.scrollTop = elem.scrollHeight;
    }

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = async (e) => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
            scrollDown();

            if (message.includes('Success!')) {
                setSuccess(true);
                // We need to wait a bit for channels to catch up
                await sleep(1500);
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}/channel/${channel.pubkey}`);
                const updatedChannel = await response.json();
                dispatch({ ...SET_CHANNEL, payload: updatedChannel })
                AntMessage.success('Success!');
                setRebalancing(false);

                // Refetch channels in the background
                const channelsResponse = await fetch(`http://${process.env.REACT_APP_API_URL}/channels`);
                const channels = await channelsResponse.json();

                dispatch({ ...FETCH_CHANNELS, payload: channels });
            }

            if (message.includes('Could not find any suitable route')) {
                AntMessage.error('No luck rebalancing');
                setSuccess(false);
                setRebalancing(false);
            }
        }

    }, [channel.pubkey, messages, setMessages, socket, onRebalance, dispatch]);

    const handleRebalance = async () => {
        setRebalancing(true);
        const channelId = channel.channelId
        const direction = channel.localBalance < channel.remoteBalance ? '-t' : '-f';

        const message = { channelId, direction };

        if (amount > 0) {
            message['amount'] = amount;
        }

        try {
            socket().send(JSON.stringify(message));
        } catch (error) {
            setMessages([error]);
        }

    }

    const handleAmountChange = (value) => {
        if (value) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    }

    const handleCancel = () => {
        socket().send(JSON.stringify('CANCEL'));
        setMessages([...messages, '😢 Cancelled 😢'])
        setRebalancing(false);
        scrollDown();
    }

    return (
        <div className="rebalance">
            <Channel channel={channel} onSelect={onSelect} />

            <div className="specific-amount">
                <label htmlFor="amount">Rebalance Amount (Sats)</label>
                <InputNumber
                    name="amount"
                    className="sat-input"
                    placeholder={channel.amountFor5050}
                    value={amount}
                    onChange={handleAmountChange}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            </div>

            <div className="messages">
                {messages.map((msg, index) =>
                    <p key={index}>{msg}</p>
                )}
            </div>

            {rebalancing ?
                <Button type="warning" className="cancel" onClick={handleCancel}>Cancel</Button> :
                <Button type="primary" className="rebalance-button" onClick={handleRebalance}>
                    Rebalance
                </Button>
            }

        </div>
    )
}

export default Rebalance;