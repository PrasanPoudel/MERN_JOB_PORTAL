import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export const useSocketEvents = ({
  onNewMessage,
  onConversationUpdate,
  onUnreadCountUpdate,
  onMessageReadStatus,
}, deps = []) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      if (onNewMessage) onNewMessage(message);
    };

    const handleConversationListUpdate = (updatedConversations) => {
      if (onConversationUpdate) onConversationUpdate(updatedConversations);
    };

    const handleUnreadCountUpdate = (data) => {
      if (onUnreadCountUpdate) onUnreadCountUpdate(data);
    };

    const handleMessageReadStatus = (data) => {
      if (onMessageReadStatus) onMessageReadStatus(data);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("conversation_list_update", handleConversationListUpdate);
    socket.on("unread_count_update", handleUnreadCountUpdate);
    socket.on("message_read_status", handleMessageReadStatus);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("conversation_list_update", handleConversationListUpdate);
      socket.off("unread_count_update", handleUnreadCountUpdate);
      socket.off("message_read_status", handleMessageReadStatus);
    };
  }, [socket, isConnected, ...deps]);

  return {
    socket,
    isConnected
  };
};


export const useMarkMessagesAsRead = (messages, user, onMarkRead) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!messages || messages.length === 0 || !socket || !isConnected || !user) return;

    // Find unread messages from the current user
    const unreadMessages = messages.filter(
      msg => !msg.read && msg.recipient?._id === user._id
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach(msg => {
        // Mark message as read via socket
        socket.emit("mark_message_read", { messageId: msg._id });
        if (onMarkRead) onMarkRead(msg._id);
      });
    }
  }, [messages, user, socket, isConnected, onMarkRead]);
};