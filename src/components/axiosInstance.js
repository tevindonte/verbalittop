// src/components/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://verbalitserver.onrender.com", // Backend base URL
  withCredentials: true, // Send cookies with every request
});

export default axiosInstance;
