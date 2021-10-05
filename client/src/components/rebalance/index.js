import { Button, InputNumber, message as AntMessage, Slider, Checkbox } from 'antd';
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
    const [feeFactor, setFeeFactor] = useState(1);
    const [reckless, setReckless] = useState(false);
    const [success, setSuccess] = useState(false);
    const { dispatch } = useContext(store);

    const { messages, sendMessage } = useSocket('rebalance', () => setRebalancing(false));

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
        scrollDown();
        if (messages.length && messages[messages.length - 1].includes('Successful route')) {
            setRebalancing(false);
            setSuccess(true);
        }
    }, [messages])

    const handleRebalance = async () => {
        setRebalancing(true);
        const channelId = channel.channelId
        // const direction = channel.localBalance < channel.remoteBalance ? '-t' : '-f';

        // const message = { channelId, direction };
        const message = { to: `${channelId}` }

        if (amount > 0) {
            message['amount'] = amount;
        }

        if (reckless) {
            message['reckless'] = true;
        }

        try {
            sendMessage(JSON.stringify(message));
        } catch (error) {
            console.log('setting error message here');
            // setMessages([error]);
        }

    }

    const handleAmountChange = (value) => {
        if (value) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    }

    const handleFeeChange = (value) => {
        if (value) {
            setFeeFactor(value);
        } else {
            setFeeFactor(1);
        }
    }

    const handleCancel = () => {
        // socket().send(JSON.stringify('CANCEL'));
        console.log('setting cancelled message');
        // setMessages([...messages, '😢 Cancelled 😢'])
        setRebalancing(false);
        scrollDown();
    }

    return (
        <div className="rebalance">
            <Channel channel={channel} onSelect={onSelect} />

            <div className="adjustments">
                <div className="value-adjuster">
                    <label htmlFor="amount">Rebalance Amount (Sats)</label>
                    <InputNumber
                        name="amount"
                        className="input"
                        placeholder={channel.rebalanceAmount}
                        value={amount}
                        onChange={handleAmountChange}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </div>

                <div className="value-adjuster">
                    <label htmlFor="fee" className="label-spaced">
                        Fee Factor - {feeFactor}
                        {feeFactor !== 1 && <span className="label-clickable" onClick={() => setFeeFactor(1)}>reset</span>}
                    </label>
                    <Slider name="fee" className="input" step={0.1} min={0.5} max={1.5} tooltipVisible={false} value={feeFactor} onChange={handleFeeChange} />
                </div>

                <div className="value-adjuster">
                    <Checkbox checked={reckless} onChange={() => setReckless(!reckless)}>Reckless</Checkbox>
                </div>
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