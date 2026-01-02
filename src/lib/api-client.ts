import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;

export const privateClient = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

privateClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const user = auth.currentUser;
        if (!user) throw error;
        const token = await user.getIdToken(true);
        original.headers.Authorization = `Bearer ${token}`;
        return privateClient.request(original);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }
    }

    throw error;
  }
);

export const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});
