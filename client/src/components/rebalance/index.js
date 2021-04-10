import { useState, useEffect } from "react";
import { Channel } from "..";
import useSocket from "../../hooks/use-socket";

import "./style.scss";

const Rebalance = ({ channel, onSelect }) => {
    const [rebalancing, setRebalancing] = useState(false);
    const [messages, setMessages] = useState([]);

    const { socket, reconnect } = useSocket('rebalance');

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = (e) => {
            const message = JSON.parse(e.data);
            setMessages([...messages, message]);
            console.log("e", message);
        }

    }, [messages, setMessages, socket]);

    const handleRebalance = () => {
        setRebalancing(true);
        const channelId = channel.channelId
        const direction = channel.localBalance < channel.remoteBalance ? '-t' : '-f';

        const message = JSON.stringify({ channelId, direction })

        try {
            socket().send(message);
        } catch (err) {
            reconnect();
            socket().send(message);
        }
    }

    return (
        <div className="rebalance">
            <Channel channel={channel} onSelect={onSelect} />

            {rebalancing ?
                <div className="messages">
                    <p>Rebalancing</p>
                    {messages.map(msg =>
                        <p>{msg}</p>
                    )}
                </div>
                : <button onClick={handleRebalance}>Rebalance</button>}
        </div>
    )
}

export default Rebalance;