import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workshop {
  id: string;
  name: string;
  nit: string;
  phone: string;
  email: string;
  address: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  token: string | null;
  workshop: Workshop | null;
  setWorkshop: (workshop: Workshop | null) => void;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      workshop: null,
      setWorkshop: (workshop) => set({ workshop }),
      setAuth: (token) => set({ token }),
      logout: () => set({ token: null, workshop: null }),
    }),
    { name: 'auth-storage' }
  )
);