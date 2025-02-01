// src/components/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Backend base URL
  withCredentials: true, // Send cookies with every request
});

export default axiosInstance;
