import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  adminPassword: string;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      // In a real app, this would be handled securely on a backend
      adminPassword: 'admin123',
      login: (password: string) => {
        const isCorrect = password === 'admin123';
        if (isCorrect) {
          set({ isAdmin: true, user: { isAdmin: true } });
        }
        return isCorrect;
      },
      logout: () => set({ isAdmin: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);