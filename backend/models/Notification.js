import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  to: String,
  subject: String,
  body: String,
  status: { type: String, default: "sent" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);