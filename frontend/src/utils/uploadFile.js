import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadFile = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // File type validation - only allow images and PDFs
  const allowedTypes = [
    "image/jpeg",
    "image/jpg", 
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed.");
  }

  // File size validation
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
  const MAX_PDF_SIZE = 10 * 1024 * 1024;  // 10MB for PDFs

  const fileSize = file.size;
  const fileType = file.type;

  let maxSize = 0;
  let maxSizeMB = 0;

  if (fileType.startsWith("image/")) {
    maxSize = MAX_IMAGE_SIZE;
    maxSizeMB = 5;
  } else if (fileType === "application/pdf") {
    maxSize = MAX_PDF_SIZE;
    maxSizeMB = 10;
  }

  if (fileSize > maxSize) {
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size too large. Maximum allowed size is ${maxSizeMB}MB for ${fileType.startsWith("image/") ? "images" : "PDFs"}. Your file is ${fileSizeMB}MB.`
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      API_PATHS.FILE.UPLOAD_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return {
      fileUrl: response.data.fileUrl,
      publicId: response.data.publicId,
      format: response.data.format,
      resourceType: response.data.resourceType
    };
  } catch (err) {
    console.error("[File Upload Error]", {
      fileName: file?.name,
      fileSize: file?.size,
      error: err.message || err
    });
    throw err;
  }
};

export default uploadFile;
