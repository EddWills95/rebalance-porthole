import { useState, useEffect } from "react";
import { Channel } from "..";
import useSocket from "../../hooks/use-socket";

const Rebalance = ({ channel, onSelect }) => {
    const [rebalancing, setRebalancing] = useState(false);
    const [message, setMessage] = useState('');

    const { socket, reconnect, closed } = useSocket('rebalance');

    useEffect(() => {
        if (!socket) return;

        socket().onmessage = (e) => {
            const message = JSON.parse(e.data);
            setMessage(message);
            console.log("e", message);
        }

    }, [socket]);

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
        <>
            <Channel channel={channel} onSelect={onSelect} />

            {rebalancing ? <p>Rebalancing: {message}</p> : <button onClick={handleRebalance}>Rebalance</button>}
        </>
    )
}

export default Rebalance;