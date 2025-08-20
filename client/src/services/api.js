import axios from "axios";

// Environment-based URL configuration
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const uploadExcel = (formData) => API.post("/data/upload", formData);
export const saveChartMeta = (data) => API.post("/data/chart-meta", data);
export const getDataset = (id) => API.get(`/data/${id}`);
export const deleteData = (id) => API.delete(`/data/${id}`);
export const fetchDashboardData = () => API.get("/data/dashboard");
export const fetchChartHistory = () => API.get("/data");
export const fetchData = () => API.get("/data");