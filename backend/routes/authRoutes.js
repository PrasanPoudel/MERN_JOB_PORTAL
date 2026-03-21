const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { uploadToCloudinary } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/upload-file", protect, uploadToCloudinary, (req, res) => {
  const { uploadResult } = req;
  
  if (!uploadResult.success) {
    return res.status(500).json({ 
      message: uploadResult.error 
    });
  }

  res.status(200).json({ 
    fileUrl: uploadResult.url,
    publicId: uploadResult.publicId,
    format: uploadResult.format,
    resourceType: uploadResult.resourceType,
    originalFilename: uploadResult.originalFilename
  });
});

module.exports = router;
