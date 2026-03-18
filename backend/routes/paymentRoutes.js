const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  generateSignature,
  upgradeToPremiumUser,
} = require("../controllers/paymentController");

router.post("/generate-signature", protect, generateSignature);
router.post("/upgradeToPremiumUser", protect, upgradeToPremiumUser);

module.exports = router;
