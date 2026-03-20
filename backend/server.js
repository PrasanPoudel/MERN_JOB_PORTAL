require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

connectDB();

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many login attempts. Please try again after 15 minutes.",
    });
  },
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 250,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please try again after 15 minutes.",
    });
  },
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", apiLimiter, userRoutes);
app.use("/api/jobs", apiLimiter, jobRoutes);
app.use("/api/applications", apiLimiter, applicationRoutes);
app.use("/api/save-jobs", apiLimiter, savedJobRoutes);
app.use("/api/analytics", apiLimiter, analyticsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
//Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Start uploads cleanup cron job

// require("./cleanupUploadsCron");

// Start job deadline cron job
// const { startCronJobs } = require("./services/cronService");
// startCronJobs();

app.get("/", (req, res) => {
  res.send("Hello world!");
});
