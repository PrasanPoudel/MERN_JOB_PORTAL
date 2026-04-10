const User = require("../models/User");
const PremiumSubscription = require("../models/PremiumSubscription");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

exports.generateSignature = async (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;
  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("base64");

  return res.json({ signature });
};

exports.upgradeToPremiumUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has active premium subscription
    const existingSubscription = await PremiumSubscription.findOne({
      userId: user._id,
      status: "completed",
      expiresAt: { $gt: new Date() },
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: "User already has an active premium subscription",
        expiresAt: existingSubscription.expiresAt,
      });
    }

    // Generate unique transaction ID
    const transactionId = uuidv4();

    // Create subscription record with transaction ID
    const subscription = await PremiumSubscription.create({
      userId: user._id,
      amount: 100,
      paymentMethod: "esewa",
      transactionId: transactionId,
      status: "completed",
      issuedAt: new Date(),
    });

    // Update user premium status
    user.isPremium = true;
    user.premiumIssueDate = new Date();
    await user.save();

    res.status(200).json({
      message: "Payment Successful",
      subscription,
      transactionId,
    });
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Failed to process payment. Please try again.",
        error: "Transaction ID already exists",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.paymentFailed = async (req, res) => {
  try {
    const { failureReason } = req.body;

    // Log payment failure but don't create any database record
    console.log(
      `Payment failed for user ${req.user._id}. Reason: ${failureReason || "Not provided"}`,
    );

    res.status(200).json({
      message: "Payment failure logged",
      user: req.user._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
