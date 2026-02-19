const express = require("express");
const {
  sendMessage,
  getConversation,
  getConversationsV2,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Send a message
router.post("/send", protect, sendMessage);

// Get messages for a conversation
router.get("/conversation/:applicationId", protect, getConversation);

// Get all conversations for current user
router.get("/conversations", protect, getConversationsV2);

module.exports = router;
