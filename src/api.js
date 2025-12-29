import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080/api";

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

export default api;
