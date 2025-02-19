import axios from "axios";

// Enable credentials (for cookies, authorization headers, etc.)
axios.defaults.withCredentials = true;

// Set API base URL from environment variables or fallback to default
const API_BASE_URL = process.env.VITE_API_URI || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivateInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
