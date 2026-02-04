import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// 1. Instancia para peticiones públicas (Login)
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 2. Instancia protegida (inyecta el token automáticamente)
export const apiAuth = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Antes de cada petición, busca el token y pégalo
apiAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);