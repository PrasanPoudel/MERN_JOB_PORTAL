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
    }, 
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    no_of_vacancy: { 
      type: Number, 
      required: true,
      min: 1,
      validate: {
        validator: function(v) {
          return Number.isInteger(v) && v > 0;
        },
        message: 'Number of vacancies must be a positive integer'
      }
    },
    application_deadline_date: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Application deadline must be in the future'
      }
    },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
