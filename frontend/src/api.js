import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;
