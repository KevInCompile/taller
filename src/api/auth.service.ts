import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: "https://taller-motos-backend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    if (data.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);
    return data;
  }
};

export default api;
