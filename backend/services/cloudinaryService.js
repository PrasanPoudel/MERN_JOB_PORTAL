const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    return true;
  } catch (error) {
    console.log("Cloudinary configuration error:", error.message);
    throw error;
  }
};

// Initialize Cloudinary on module load
configureCloudinary();

const uploadFile = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: "uploaded_files",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      transformation: [
        { width: 500, height: 500, crop: "limit" }
      ]
    };

    const uploadOptions = { ...defaultOptions, ...options };

    let uploadSource;
    
    // Handle different file input types
    if (file && file.buffer) {
      // Multer memory storage - use buffer
      uploadSource = file.buffer;
    } else if (file && file.path && typeof file.path === 'string') {
      // Multer disk storage - use file path
      uploadSource = file.path;
    } else if (typeof file === 'string') {
      // Direct file path or URL
      uploadSource = file;
    } else {
      throw new Error("Invalid file input format. Expected file object with buffer/path or string path");
    }

    // Additional validation for buffer type
    if (Buffer.isBuffer(uploadSource)) {
      // For buffer uploads, we need to convert to base64 data URI
      const base64Data = uploadSource.toString('base64');
      uploadSource = `data:${file.mimetype || 'application/octet-stream'};base64,${base64Data}`;
    }

    const result = await cloudinary.uploader.upload(uploadSource, uploadOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      bytes: result.bytes,
      originalFilename: result.original_filename
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "File upload failed"
    };
  }
};

const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error.message || "File deletion failed"
    };
  }
};

const getImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 400,
    height: 400,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto"
  };

  const transformationOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, transformationOptions);
};

const getPdfUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "raw"
  });
};

const getResourceType = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType === "application/pdf") {
    return "raw";
  } else {
    return "auto";
  }
};

module.exports = {
  cloudinary,
  uploadFile,
  deleteFile,
  getImageUrl,
  getPdfUrl,
  getResourceType,
  configureCloudinary
};