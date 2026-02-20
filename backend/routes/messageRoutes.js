const express = require("express");
const {
  sendMessage,
  getConversation,
  getConversationsV2,
  getTotalUnreadCount,
  getUserAdminMessages,
  sendMessageToAdmin,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Send a message
router.post("/send", protect, sendMessage);

// Get messages for a conversation
router.get("/conversation/:applicationId", protect, getConversation);

// Get all conversations for current user
router.get("/conversations", protect, getConversationsV2);

// Get total unread count
router.get("/unread-count", protect, getTotalUnreadCount);

// Get admin messages for current user
router.get("/admin-messages", protect, getUserAdminMessages);

// Send message to admin
router.post("/send-to-admin", protect, sendMessageToAdmin);

module.exports = router;
