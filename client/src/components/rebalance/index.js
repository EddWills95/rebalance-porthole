import { useState, useEffect, useContext } from "react";
import { Channel } from "..";
import useSocket from "../../hooks/use-socket";
import { SET_CHANNEL } from "../../store/actions";
import { store } from "../../store/store";

import "./style.scss";

const Rebalance = ({ channel, onSelect, onRebalance = () => { } }) => {
    const [rebalancing, setRebalancing] = useState(false);
    const [amount, setAmount] = useState(channel.amountFor5050);
    const [messages, setMessages] = useState([]);
    const { dispatch } = useContext(store);

    const { socket, reconnect, closed } = useSocket('rebalance');

    console.log(channel);

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = async (e) => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
            var elem = document.querySelector('.messages');
            elem.scrollTop = elem.scrollHeight;

            if (message.includes('Success!')) {
                const response = await fetch(`http://localhost:3001/channel/${channel.pubkey}`);
                const updatedChannel = await response.json();
                console.log(updatedChannel);
                dispatch({ ...SET_CHANNEL, payload: updatedChannel })
            }
        }

        socket().onclose = async () => {
            setRebalancing(false);
        }

    }, [channel.pubkey, messages, setMessages, socket, onRebalance, dispatch]);

    const handleRebalance = () => {
        setRebalancing(true);
        const channelId = channel.channelId
        const direction = channel.localBalance < channel.remoteBalance ? '-t' : '-f';

        const message = { channelId, direction };

        if (amount > 0) {
            message['amount'] = amount;
        }

        if (closed) {
            reconnect();
            setMessages([]);
            socket().send(JSON.stringify(message));
        } else {
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