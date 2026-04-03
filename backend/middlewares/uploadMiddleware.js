const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Generic Cloudinary storage that auto detects file type
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("image/")) {
      return {
        folder: "job-portal/avatars",
        allowed_formats: ["jpeg", "jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    } else if (file.mimetype === "application/pdf") {
      return {
        folder: "job-portal/resumes",
        allowed_formats: ["pdf"],
      };
    }
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only .jpeg, .jpg, .png, and .pdf formats are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

module.exports = upload;
