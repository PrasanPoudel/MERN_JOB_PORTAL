const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

// Existing routes (implemented by teammate)
router.get("/stats", protect, adminController.getAdminStats);
router.get("/users", protect, adminController.getAllUsers);
router.get("/users/:id", protect, adminController.getUserById);
router.delete("/users/:id", protect, adminController.deleteUser);
router.get("/jobs", protect, adminController.getAllJobs);
router.delete("/jobs/:id", protect, adminController.deleteJobByAdmin);

// Admin messaging
router.post("/messages/send", protect, adminController.sendAdminMessage);
router.get("/messages/conversations", protect, adminController.getAdminConversations);
router.get("/messages/conversation/:userId", protect, adminController.getAdminConversation);
router.get("/analytics/daily", protect, adminController.getDailyAnalytics);
router.get("/analytics/risk-distribution", protect, adminController.getRiskDistribution);

// Company verification routes
router.get("/companies", protect, adminController.getAllCompanies);
router.get("/companies/pending", protect, adminController.getPendingCompanies);
router.get("/companies/:id", protect, adminController.getCompanyDetails);
router.put("/companies/:id/verify", protect, adminController.verifyCompany);
router.put("/companies/:id/remove-verification", protect, adminController.removeCompanyVerification);

module.exports = router;
