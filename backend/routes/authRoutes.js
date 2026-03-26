const express = require("express");
const { register, login, getMe, sendVerificationEmail, verifyEmail, resendVerification, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const upload= require("../middlewares/uploadMiddleware");

router.post("/register", register);
router.post("/login", login);

// Email verification routes
router.post("/send-verification", sendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/upload-file", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl });
  });
});


module.exports = router;
