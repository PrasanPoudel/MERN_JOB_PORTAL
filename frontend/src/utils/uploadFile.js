import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadFile = async (file) => {
  if (!file) {
    throw new Error("No file provided");
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
