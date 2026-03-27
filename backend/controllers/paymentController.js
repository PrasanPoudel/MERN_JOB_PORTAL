const User = require("../models/User");
const PremiumSubscription = require("../models/PremiumSubscription");
const crypto = require("crypto");

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
    
    user.isPremium = true;
    user.premiumIssueDate = new Date();
    await user.save();

    // Create subscription record for tracking
    const subscription = await PremiumSubscription.create({
      userId: user._id,
      amount: 100,
      paymentMethod: "esewa",
      status: "completed",
      issuedAt: new Date(),
    });

    res.status(200).json({ message: "Payment Successful", subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
