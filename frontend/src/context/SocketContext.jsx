import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connectSocket = () => {
    if (!isAuthenticated || !user || socket) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setConnectionError("No authentication token found");
        return;
      }

      const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:8000", {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
        setSocket(newSocket);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not manually disconnected
        if (reason !== "io client disconnect") {
          handleReconnect();
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setConnectionError(error.message || "Connection failed");
        setIsConnected(false);
        
        // Attempt to reconnect on connection error
        handleReconnect();
      });

      // Listen for unread count updates
      newSocket.on("unread_count_update", (data) => {
        console.log("Unread count updated:", data);
        // This will be handled by components that need it
      });

      // Listen for new messages
      newSocket.on("new_message", (message) => {
        console.log("New message received:", message);
        // This will be handled by components that need it
      });

      // Listen for conversation list updates
      newSocket.on("conversation_list_update", (conversations) => {
        console.log("Conversation list updated:", conversations);
        // This will be handled by components that need it
      });

      // Listen for message read events
      newSocket.on("message_read", (data) => {
        console.log("Message marked as read:", data);
        // This will be handled by components that need it
      });

      // Listen for typing indicators
      newSocket.on("typing", (data) => {
        console.log("Typing indicator:", data);
        // This will be handled by components that need it
      });

      // Listen for errors
      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
        setConnectionError(error.message || "Socket error occurred");
      });

    } catch (error) {
      console.error("Error connecting socket:", error);
      setConnectionError(error.message || "Failed to connect socket");
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionError(null);
    }
  };

  const handleReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setConnectionError(`Failed to reconnect after ${maxReconnectAttempts} attempts`);
      return;
    }

    reconnectAttempts.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);
    
    setTimeout(() => {
      disconnectSocket();
      connectSocket();
    }, delay);
  };

  const sendMessage = (data) => {
    if (socket && isConnected) {
      socket.emit("send_message", data);
    } else {
      console.warn("Socket not connected, cannot send message");
    }
  };

  const markMessageRead = (messageId) => {
    if (socket && isConnected) {
      socket.emit("mark_message_read", { messageId });
    } else {
      console.warn("Socket not connected, cannot mark message as read");
    }
  };

  const sendTypingIndicator = (data) => {
    if (socket && isConnected) {
      socket.emit("typing", data);
    }
  };

  // Connect when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && !socket) {
      connectSocket();
    } else if (!isAuthenticated && socket) {
      disconnectSocket();
    }
  }, [isAuthenticated, user, socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
    connectionError,
    sendMessage,
    markMessageRead,
    sendTypingIndicator,
    reconnect: connectSocket,
    disconnect: disconnectSocket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;