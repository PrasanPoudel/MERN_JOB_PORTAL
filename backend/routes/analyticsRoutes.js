const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getEmployerAnalytics,
  landingPageStats,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/overview", protect, getEmployerAnalytics);
router.get("/landingPageStats", landingPageStats);

module.exports = router;
