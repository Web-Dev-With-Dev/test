import axios from 'axios';
import { toast } from 'react-toastify';

// Environment-based URL configuration
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
  timeout: 10000,
});

// Add request interceptor to add auth token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'An unknown error occurred';
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      toast.error('Authentication required. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle forbidden errors
    else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle server errors
    else if (error.response?.status >= 500) {
      toast.error(`Server error: ${errorMessage}`);
    }
    
    // Handle other errors
    else {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const getUsers = () => adminApi.get('/users');
export const updateUser = (id, userData) => adminApi.put(`/users/${id}`, userData);
export const deleteUser = (id) => adminApi.delete(`/users/${id}`);
export const updateUserRole = (id, role) => adminApi.patch(`/users/${id}/role`, { role });
export const updateUserStatus = (id, status) => adminApi.patch(`/users/${id}/status`, { status });

export const getFiles = () => adminApi.get('/files');
export const downloadFile = (id) => adminApi.get(`/files/${id}/download`, { responseType: 'blob' });
export const deleteFile = (id) => adminApi.delete(`/files/${id}`);

export const getCharts = () => adminApi.get('/charts');
export const getChartPreview = (id) => adminApi.get(`/charts/${id}/preview`);
export const deleteChart = (id) => adminApi.delete(`/charts/${id}`);

export const getContacts = () => adminApi.get('/contacts');
export const deleteContact = (id) => adminApi.delete(`/contacts/${id}`);

export const getLogs = (page = 1, limit = 50, userId) => {
  const params = { page, limit };
  if (userId) params.userId = userId;
  return adminApi.get('/logs', { params });
};

export const getFileHistory = (page = 1, limit = 50, uploadedBy) => {
  const params = { page, limit };
  if (uploadedBy) params.uploadedBy = uploadedBy;
  return adminApi.get('/files/history', { params });
};

export const getStats = () => adminApi.get('/logs/stats');

export default adminApi;