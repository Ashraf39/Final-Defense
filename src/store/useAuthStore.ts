import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  userRole: string | null;
  setUser: (user: User | null) => void;
  setUserRole: (role: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  logout: () => set({ user: null, userRole: null }),
}));