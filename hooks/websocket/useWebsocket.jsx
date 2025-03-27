import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage a WebSocket connection with full-duplex communication.
 * 
 * @param {string} url - The WebSocket URL to connect to.
 * @returns {Object} - An object containing the WebSocket instance, received messages, and a function to send messages.
 */
export function useWebSocket(url) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Create a new WebSocket connection
        socketRef.current = new WebSocket(url);

        // Handle the open event
        socketRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        // Handle incoming messages
        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        // Handle the close event
        socketRef.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        // Set the socket state
        setSocket(socketRef.current);

        // Cleanup function to close the WebSocket connection
        return () => {
            socketRef.current.close();
        };
    }, [url]);

    // Function to send messages
    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return { socket, messages, sendMessage };
}
