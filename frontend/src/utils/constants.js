export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8001";

export const APP_NAME = "PharmaQMS Complaint Manager";

export const SUPPORTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "message/rfc822": [".eml"],
  "text/plain": [".txt"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
