import { useRef, useEffect, useState } from "react";

const websocket = `ws://${process.env.REACT_APP_API_URL}`;

const useSocket = (endpoint, closeCallback = () => { }) => {
    const ws = useRef(null);
    const [closed, setClosed] = useState(true);

    const getSocket = () => ws.current;
    const connect = () => {
        ws.current = new WebSocket(`${websocket}/${endpoint}`)
    }

    useEffect(() => {
        connect();
        ws.current.onopen = () => {
            setClosed(false);
        }
        ws.current.onclose = () => {
            setClosed(true);
            closeCallback && closeCallback();
        }

        return () => {
            ws.current.close();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    return { socket: getSocket, reconnect: connect, closed }

}

export default useSocket;