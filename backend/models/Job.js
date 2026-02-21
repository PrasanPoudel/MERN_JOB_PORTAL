const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    category: { type: String },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      required: true,
    },
    offer: { type: String },
    fraudScore: { type: Number, min: 0, max: 1 },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Employer
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    isClosed: { type: Boolean, default: false },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, default: "" },
    fraudScore: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
