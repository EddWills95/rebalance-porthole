import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";



const NEW_CHAT_MESSAGE_EVENT = "rebalance"; // Name of the event
const SOCKET_SERVER_URL = `http://${process.env.REACT_APP_API_URL}`;

const useSocket = (roomId) => {
    const [messages, setMessages] = useState([]); // Sent and received messages
    const socketRef = useRef();

    useEffect(() => {
        // Creates a WebSocket connection
        socketRef.current = socketIOClient(SOCKET_SERVER_URL);

        socketRef.current.on('connect', () => {
            console.info('Connected to socket');
        })

        // Listens for incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            console.log('recieved message');
            setMessages((messages) => [...messages, message]);
        });

        socketRef.current.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        // Destroys the socket reference
        // when the connection is closed
        return () => {
            console.log('disconnecting from socket');
            socketRef.current.disconnect();
        };
    }, [roomId]);

    // Sends a message to the server that
    // forwards it to all users in the same room
    const sendMessage = (message) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT,
            message
        );
    };

    return { messages, sendMessage };
};

export default useSocket;