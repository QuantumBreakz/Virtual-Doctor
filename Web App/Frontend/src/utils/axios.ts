// src/utils/axios.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Helper function to get cookies (for CSRF token)
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// Create axios instance with base URL pointing to your Django backend
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
  
});

// Add request interceptor to include CSRF token and auth token
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken && config.headers) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    const token = localStorage.getItem('auth_token');
    if (token && config.withCredentials !== false && config.headers) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// HTTP request methods
export const get = (url: string, withAuth: boolean = true) => {
  return instance.get(url, { withCredentials: withAuth });
};

export const post = (url: string, data: any, withAuth: boolean = true) => {
  return instance.post(url, data, { withCredentials: withAuth });
};

export const put = (url: string, data: any, withAuth: boolean = true) => {
  return instance.put(url, data, { withCredentials: withAuth });
};

export const del = (url: string, withAuth: boolean = true) => {
  return instance.delete(url, { withCredentials: withAuth });
};

export default instance;
