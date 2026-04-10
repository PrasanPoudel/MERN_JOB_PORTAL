const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  generateSignature,
  upgradeToPremiumUser,
  paymentFailed,
} = require("../controllers/paymentController");

router.post("/generate-signature", protect, generateSignature);
router.post("/upgradeToPremiumUser", protect, upgradeToPremiumUser);
router.post("/payment-failed", protect, paymentFailed);

module.exports = router;
