
export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'ADMIN' | 'MECHANIC';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  sessionFacebook: boolean;
  sessionGoogle: boolean;
  habeas_data: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
