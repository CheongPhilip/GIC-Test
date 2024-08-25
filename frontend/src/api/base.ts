import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add any request interceptors or other configurations here
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);
export default api;
