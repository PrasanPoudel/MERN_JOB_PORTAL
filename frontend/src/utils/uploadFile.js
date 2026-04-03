import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadFile = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Frontend file size validation
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image file size exceeds 5MB limit. Please compress your image.");
  }

  if (file.type === "application/pdf" && file.size > MAX_PDF_SIZE) {
    throw new Error("Resume file size exceeds 10MB limit. Please reduce file size.");
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
    return response.data;
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
