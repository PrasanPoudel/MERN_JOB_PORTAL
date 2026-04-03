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

router.post("/upload-file", protect, (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        // Return different message based on file type
        let message;
        if (req.file && req.file.mimetype.startsWith("image/")) {
          message = "Image file size exceeds 5MB limit. Please compress your image.";
        } else {
          message = "File size exceeds 10MB limit. Please reduce file size.";
        }
        return res.status(413).json({ message });
      }
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (req.file.mimetype.startsWith("image/") && req.file.size > 5 * 1024 * 1024) {
      return res.status(413).json({ 
        message: "Image file size exceeds 5MB limit. Please compress your image." 
      });
    }

    res.status(200).json({ 
      fileUrl: req.file.path,
      publicId: req.file.filename
    });
  });
});


module.exports = router;
