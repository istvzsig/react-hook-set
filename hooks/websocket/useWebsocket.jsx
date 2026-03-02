import { useEffect, useRef, useState } from "react";

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
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(socketRef.current);

    return () => {
      socketRef.current.close();
    };
  }, [url]);

  function sendMessage(message) {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  }

  return { socket, messages, sendMessage };
}
