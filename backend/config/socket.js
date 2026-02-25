const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const setupSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} connected with ID: ${socket.id}`);

    // Join user-specific room
    socket.join(`user:${socket.user._id}`);
    
    // Join admin room if user is admin
    if (socket.user.role === "admin") {
      socket.join("admin");
    }

    // Handle new message
    socket.on("send_message", async (data) => {
      try {
        const { applicationId, recipientId, content, isAdminMessage = false } = data;

        // Validate recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
          socket.emit("error", { message: "Recipient not found" });
          return;
        }

        // Create message in database
        const messageData = {
          application: applicationId || null,
          sender: socket.user._id,
          senderRole: socket.user.role,
          recipient: recipientId,
          content,
          isAdminMessage,
        };

        const message = await Message.create(messageData);
        
        // Populate message for response
        await message.populate("sender", "name avatar email role");
        await message.populate("recipient", "name avatar email role");

        // Determine target room
        let targetRoom;
        if (isAdminMessage) {
          // Admin message goes to admin room or specific user
          if (socket.user.role === "admin") {
            targetRoom = `user:${recipientId}`;
          } else {
            targetRoom = "admin";
          }
        } else {
          // Regular conversation message
          targetRoom = `user:${recipientId}`;
        }

        // Send message to recipient
        io.to(targetRoom).emit("new_message", message);

        // Send message back to sender for confirmation
        socket.emit("message_sent", message);

        // Update unread count for recipient
        const unreadCount = await Message.countDocuments({
          recipient: recipientId,
          read: false,
        });

        // Send unread count update to recipient
        io.to(`user:${recipientId}`).emit("unread_count_update", { 
          totalUnreadCount: unreadCount 
        });

        // Update conversation list for both parties
        await updateConversationList(socket.user._id, io);
        await updateConversationList(recipientId, io);

      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: err.message });
      }
    });

    // Handle message read
    socket.on("mark_message_read", async (data) => {
      try {
        const { messageId } = data;

        // Update message as read
        const message = await Message.findByIdAndUpdate(
          messageId,
          { read: true },
          { new: true }
        );

        if (message) {
          // Update unread count for recipient
          const unreadCount = await Message.countDocuments({
            recipient: socket.user._id,
            read: false,
          });

          // Emit read confirmation and updated unread count to recipient
          socket.emit("message_read", { messageId });
          socket.emit("unread_count_update", { 
            totalUnreadCount: unreadCount 
          });

          // Broadcast read status to sender (for double tick functionality)
          if (message.sender._id.toString() !== socket.user._id.toString()) {
            io.to(`user:${message.sender._id}`).emit("message_read_status", {
              messageId: message._id,
              read: true,
              timestamp: new Date()
            });
          }

          // Update conversation list for both parties
          await updateConversationList(socket.user._id, io);
          await updateConversationList(message.sender._id, io);
        }

      } catch (err) {
        console.error("Error marking message as read:", err);
        socket.emit("error", { message: err.message });
      }
    });

    // Handle typing indicator
    socket.on("typing", (data) => {
      const { recipientId, isTyping } = data;
      io.to(`user:${recipientId}`).emit("typing", {
        senderId: socket.user._id,
        isTyping,
        senderName: socket.user.name,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.user.name} disconnected`);
    });

    // Handle errors
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  // Function to update conversation list for a user
  const updateConversationList = async (userId, io) => {
    try {
      // Get user to determine role
      const user = await User.findById(userId);
      if (!user) return;

      let conversations = [];

      if (user.role === "admin") {
        // Admin conversations with users
        const messages = await Message.find({
          $or: [
            { sender: userId, isAdminMessage: true },
            { recipient: userId, senderRole: "admin", isAdminMessage: true },
          ],
        })
        .populate("sender", "name avatar email role")
        .populate("recipient", "name avatar email role")
        .sort({ createdAt: -1 });

        const uniqueUsers = new Set();
        const userConversations = [];

        messages.forEach(msg => {
          const otherUser = msg.sender._id.toString() === userId.toString() 
            ? msg.recipient 
            : msg.sender;
          
          if (!uniqueUsers.has(otherUser._id.toString())) {
            uniqueUsers.add(otherUser._id.toString());
            userConversations.push({
              user: otherUser,
              lastMessage: msg,
              unreadCount: 0, // Will be calculated below
            });
          }
        });

        // Calculate unread counts for each conversation
        for (let conv of userConversations) {
          conv.unreadCount = await Message.countDocuments({
            $or: [
              { sender: conv.user._id, recipient: userId, read: false },
              { sender: userId, recipient: conv.user._id, read: false },
            ],
            isAdminMessage: true,
          });
        }

        conversations = userConversations;

      } else {
        // Regular user conversations (job applications + admin)
        
        // Get job application conversations
        let applications = [];
        if (user.role === "jobSeeker") {
          applications = await Message.find({
            $or: [
              { "sender._id": userId },
              { "recipient._id": userId },
            ],
            isAdminMessage: false,
          })
          .populate("sender", "name avatar email role")
          .populate("recipient", "name avatar email role")
          .populate("application")
          .sort({ createdAt: -1 });
        } else {
          // Employer logic would go here
          applications = await Message.find({
            $or: [
              { "sender._id": userId },
              { "recipient._id": userId },
            ],
            isAdminMessage: false,
          })
          .populate("sender", "name avatar email role")
          .populate("recipient", "name avatar email role")
          .populate("application")
          .sort({ createdAt: -1 });
        }

        // Get admin messages
        const adminMessages = await Message.find({
          $or: [
            { sender: userId, isAdminMessage: true },
            { recipient: userId, senderRole: "admin", isAdminMessage: true },
          ],
        })
        .populate("sender", "name avatar email role")
        .populate("recipient", "name avatar email role")
        .sort({ createdAt: -1 });

        // Combine and deduplicate
        const conversationMap = new Map();

        // Process job application messages
        applications.forEach(msg => {
          const convId = msg.application?._id || "no-app";
          if (!conversationMap.has(convId)) {
            conversationMap.set(convId, {
              application: msg.application,
              lastMessage: msg,
              unreadCount: 0,
            });
          } else {
            const existing = conversationMap.get(convId);
            if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
              existing.lastMessage = msg;
            }
          }
        });

        // Process admin messages
        if (adminMessages.length > 0) {
          const adminConv = {
            isAdminConversation: true,
            application: { _id: "admin" },
            user: adminMessages[0].sender.role === "admin" ? adminMessages[0].sender : adminMessages[0].recipient,
            lastMessage: adminMessages[adminMessages.length - 1],
            unreadCount: 0,
          };
          conversationMap.set("admin", adminConv);
        }

        // Calculate unread counts
        for (let [key, conv] of conversationMap.entries()) {
          if (conv.isAdminConversation) {
            conv.unreadCount = await Message.countDocuments({
              $or: [
                { sender: conv.user._id, recipient: userId, read: false },
                { sender: userId, recipient: conv.user._id, read: false },
              ],
              isAdminMessage: true,
            });
          } else {
            conv.unreadCount = await Message.countDocuments({
              application: conv.application?._id,
              recipient: userId,
              read: false,
            });
          }
        }

        conversations = Array.from(conversationMap.values());
      }

      // Send updated conversation list
      io.to(`user:${userId}`).emit("conversation_list_update", conversations);
    } catch (err) {
      console.error("Error updating conversation list:", err);
    }
  };

  return io;
};

module.exports = setupSocket;