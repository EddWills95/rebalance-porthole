import { useState, useEffect } from "react";
import { Channel } from "..";
import useSocket from "../../hooks/use-socket";

import "./style.scss";

const Rebalance = ({ channel, onSelect, onRebalance = () => { } }) => {
    const [rebalancing, setRebalancing] = useState(false);
    const [amount, setAmount] = useState(undefined);
    const [messages, setMessages] = useState([]);

    const { socket, reconnect } = useSocket('rebalance');

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = (e) => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
            var elem = document.querySelector('.messages');
            elem.scrollTop = elem.scrollHeight;
        }

        socket().onclose = () => {
            setRebalancing(false);
            onRebalance();
        }

    }, [messages, setMessages, socket, onRebalance]);

    const handleRebalance = () => {
        setRebalancing(true);
        const channelId = channel.channelId
        const direction = channel.localBalance < channel.remoteBalance ? '-t' : '-f';

        const message = { channelId, direction };

        if (amount > 0) {
            message['amount'] = amount;
        }

        try {
            socket().send(JSON.stringify(message));
        } catch (err) {
            reconnect();
            socket().send(JSON.stringify(message));
        }
    }

    const handleAmountChange = ({ target: { value } }) => {
        if (value) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    }

    return (
        <div className="rebalance">
            <Channel channel={channel} onSelect={onSelect} />

            <div className="specific-amount">
                <label htmlFor="amount">Rebalance Amount (Sats)</label>
                <input name="amount" placeholder={channel.amountFor5050} value={amount} onChange={handleAmountChange} />
            </div>

            <div className="messages">
                {messages.map((msg, index) =>
                    <p key={index}>{msg}</p>
                )}
            </div>

            <button disabled={rebalancing} className="rebalance-button" onClick={handleRebalance}>
                {rebalancing ? "..." : "Rebalance"}
            </button>
        </div>
    )
}

export default Rebalance;