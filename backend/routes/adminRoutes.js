const express = require("express");
const {
  getAdminStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllJobs,
  deleteJobByAdmin,
  sendAdminMessage,
  getAdminConversations,
  getAdminConversation,
  sendUserReplyToAdmin,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin stats and dashboard
router.get("/stats", protect, getAdminStats);

// User management
router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.delete("/users/:id", protect, deleteUser);

// Job management
router.get("/jobs", protect, getAllJobs);
router.delete("/jobs/:id", protect, deleteJobByAdmin);

// Admin messaging
router.post("/messages/send", protect, sendAdminMessage);
router.get("/messages/conversations", protect, getAdminConversations);
router.get("/messages/conversation/:userId", protect, getAdminConversation);
router.post("/messages/reply", protect, sendUserReplyToAdmin);

module.exports = router;
