import { useState, useEffect, useContext } from "react";
import { Channel } from "..";
import { useSocket } from "../../hooks";
import { sleep } from "../../utils";
import { SET_CHANNEL } from "../../store/actions";
import { store } from "../../store/store";

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

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = async (e) => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
            var elem = document.querySelector('.messages');
            elem.scrollTop = elem.scrollHeight;

            if (message.includes('Success!')) {
                setSuccess(true);
                // We need to wait a bit for channels to catch up
                await sleep(1500);
                const response = await fetch(`http://localhost:3001/channel/${channel.pubkey}`);
                const updatedChannel = await response.json();
                dispatch({ ...SET_CHANNEL, payload: updatedChannel })
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

    const handleAmountChange = ({ target: { value } }) => {
        if (value) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    }

    return (
        <div className="rebalance">
            <Channel channel={channel} onSelect={onSelect} channelNotification={success && <p>Success!</p>} />

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