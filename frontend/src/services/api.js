import axios from "axios";

import { API_BASE_URL } from "../utils/constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(message));
  }
);

export const healthCheck = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

export const getComplaints = async () => {
  const response = await apiClient.get("/complaints");
  return response.data;
};

export const getComplaint = async (complaintId) => {
  const response = await apiClient.get(`/complaints/${complaintId}`);
  return response.data;
};

export const createComplaint = async (payload) => {
  const response = await apiClient.post("/complaints", payload);
  return response.data;
};

export const analyzeComplaint = async (payload) => {
  const formData = new FormData();

  if (payload?.text) {
    formData.append("text", payload.text);
  }

  if (payload?.file) {
    formData.append("file", payload.file);
  }

  const response = await apiClient.post("/ai/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default apiClient;
