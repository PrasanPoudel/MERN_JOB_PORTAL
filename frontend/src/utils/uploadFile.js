import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post(
      API_PATHS.FILE.UPLOAD_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", //file upload
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Error uploading file", err);
    throw err; //rethrow error for handling (axios Instance)
  }
};

export default uploadFile;
