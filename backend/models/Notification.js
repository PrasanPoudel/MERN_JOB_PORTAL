const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  status: { type: String, default: "sent" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);