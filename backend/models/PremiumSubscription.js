const mongoose = require("mongoose");

const premiumSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 100,
    },
    paymentMethod: {
      type: String,
      default: "esewa",
    },
    transactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["completed", "refunded", "failed"],
      default: "completed",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Premium expires after 1 month
        const date = new Date(this.issuedAt);
        date.setMonth(date.getMonth() + 1);
        return date;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PremiumSubscription", premiumSubscriptionSchema);