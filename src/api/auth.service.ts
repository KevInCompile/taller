import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginFormData } from '../schemas/auth.schema';

const api = axios.create({
  baseURL: "https://taller-motos-backend-production.up.railway.app/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginFormData): Promise<{ token: string, message: string }> => {
    const { data } = await api.post('/auth/login', credentials);

    if (data.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  },

  register: async (userData: any): Promise<void> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  }
};

export default api;
