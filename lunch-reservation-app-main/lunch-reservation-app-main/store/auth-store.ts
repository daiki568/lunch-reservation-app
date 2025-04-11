import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAdmin: boolean;
  adminPin: string;
  login: (pin: string) => boolean;
  logout: () => void;
  setAdminPin: (pin: string) => void;
}

// デフォルトの管理者PIN: 1234
const DEFAULT_ADMIN_PIN = '1234';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAdmin: false,
      adminPin: DEFAULT_ADMIN_PIN,
      
      login: (pin: string) => {
        const isCorrect = pin === get().adminPin;
        if (isCorrect) {
          set({ isAdmin: true });
        }
        return isCorrect;
      },
      
      logout: () => {
        set({ isAdmin: false });
      },
      
      setAdminPin: (pin: string) => {
        set({ adminPin: pin });
      },
    }),
    {
      name: 'lunch-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);