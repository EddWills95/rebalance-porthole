import { Button, Checkbox, InputNumber, message as AntMessage, Slider } from 'antd';
import { useContext, useEffect, useState } from "react";
import { Channel } from "..";
import { useSocket } from "../../hooks";
import { SET_REBALANCING } from "../../store/actions";
import { INCOMING, store } from "../../store/store";
import Message from '../message';

import "./style.scss";

const Rebalance = ({ channel, onSelect, onRebalance = () => { } }) => {
    const [amount, setAmount] = useState(channel.amountFor5050);
    const [feeFactor, setFeeFactor] = useState(1);
    const [reckless, setReckless] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messages, setMessages] = useState([]);
    const { dispatch, state: { candidateDirection, rebalancing } } = useContext(store);

    const { socket } = useSocket('rebalance', () => dispatch({ type: SET_REBALANCING, payload: false }));

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
            const parsedMessage = message.split(/\n/).filter(Boolean);
            setMessages([...messages, ...parsedMessage]);
            scrollDown();

            if (message.includes('Success!')) {
                setSuccess(true);

                AntMessage.success('Success!');
                dispatch({ type: SET_REBALANCING, payload: false })
            }

            if (message.includes('Could not find any suitable route')) {
                AntMessage.error('No luck rebalancing');
                setSuccess(false);
                dispatch({ type: SET_REBALANCING, payload: false })
            }
        }

    }, [channel.pubkey, messages, setMessages, socket, onRebalance, dispatch]);

    const handleRebalance = async () => {
        dispatch({ type: SET_REBALANCING, payload: true })
        const channelId = channel.channelId
        const direction = candidateDirection === INCOMING ? '-t' : '-f';

        const message = { channelId, direction };

        if (amount > 0) {
            message['amount'] = amount;
        }

        if (reckless) {
            message['reckless'] = true;
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

    const handleFeeChange = (value) => {
        if (value) {
            setFeeFactor(value);
        } else {
            setFeeFactor(1);
        }
    }

    const handleCancel = () => {
        socket().send(JSON.stringify('CANCEL'));
        setMessages([...messages, '😢 Cancelled 😢'])
        dispatch({ type: SET_REBALANCING, payload: false })
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
                    <Message key={index} message={msg} />
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