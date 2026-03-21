const multer = require("multer");
const path = require("path");
const { uploadFile, getResourceType } = require("../services/cloudinaryService");

// Configure multer for memory storage (better for Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png", 
      "image/jpg",
      "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, .png, and .pdf formats are allowed"), false);
    }
  }
});

// Enhanced upload middleware with Cloudinary integration
const uploadToCloudinary = async (req, res, next) => {
  try {
    // Use multer to handle the file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
          error: "INVALID_FILE"
        });
      }

      // If no file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
          error: "NO_FILE"
        });
      }

      // Determine resource type based on file type
      const resourceType = getResourceType(req.file.mimetype);

      // Upload to Cloudinary
      const uploadResult = await uploadFile(req.file, {
        resource_type: resourceType,
        folder: "uploaded_files"
      });

      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          message: uploadResult.error,
          error: "CLOUDINARY_UPLOAD_FAILED"
        });
      }

      // Attach upload result to request
      req.uploadResult = uploadResult;
      next();
    });
  } catch (error) {
    console.error("Upload middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during file upload",
      error: "UPLOAD_ERROR"
    });
  }
};

// Multiple file upload middleware
const uploadMultipleToCloudinary = async (req, res, next) => {
  try {
    // Use multer to handle multiple files
    upload.array('files', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
          error: "INVALID_FILE"
        });
      }

      // If no files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
          error: "NO_FILES"
        });
      }

      const uploadResults = [];
      
      // Upload each file to Cloudinary
      for (const file of req.files) {
        const resourceType = getResourceType(file.mimetype);
        
        const uploadResult = await uploadFile(file, {
          resource_type: resourceType,
          folder: "uploaded_files"
        });

        if (!uploadResult.success) {
          return res.status(500).json({
            success: false,
            message: `Failed to upload file: ${file.originalname}`,
            error: "CLOUDINARY_UPLOAD_FAILED"
          });
        }

        uploadResults.push(uploadResult);
      }

      // Attach upload results to request
      req.uploadResults = uploadResults;
      next();
    });
  } catch (error) {
    console.error("Multiple upload middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during file upload",
      error: "UPLOAD_ERROR"
    });
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary
};