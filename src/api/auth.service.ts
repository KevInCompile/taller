import axios from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

const api = axios.create({
  baseURL: "https://taller-motos-backend.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  /**
   * Inicia sesión con las credenciales: { email, password }
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    // Si el API responde con el token, lo guardamos para futuras peticiones
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

// Exportamos la instancia por si otros servicios la necesitan
export default api;
