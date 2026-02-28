const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.post("/send-recommendations", protect, notificationController.sendJobRecommendations);


router.get("/logs", protect, notificationController.getNotificationLogs);

module.exports = router;