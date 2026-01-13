const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
const upload= require("../middlewares/uploadMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/getMe", protect, getMe);

router.post("/upload-image", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });
});


module.exports = router;
