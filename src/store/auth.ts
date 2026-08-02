import { create } from 'zustand';
import { api } from '../lib/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true, // Изначально true, пока не проверим localStorage
  
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    set({ isAuthenticated: true });
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isAuthenticated: false });
    window.location.href = '/auth/login';
  },

  checkAuth: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    set({ isAuthenticated: !!token, isLoading: false });
  },
}));