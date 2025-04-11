import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyMenu } from '@/types';

interface MenuState {
  menus: DailyMenu[];
  setDailyMenu: (date: string, name: string, description: string, price: number) => void;
  getDailyMenu: (date: string) => DailyMenu | null;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menus: [],
      
      setDailyMenu: (date: string, name: string, description: string, price: number) => {
        const existingMenuIndex = get().menus.findIndex(
          (menu) => menu.date === date
        );
        
        const newMenu: DailyMenu = {
          id: existingMenuIndex >= 0 ? get().menus[existingMenuIndex].id : Date.now().toString(),
          date,
          name,
          description,
          price,
        };
        
        if (existingMenuIndex >= 0) {
          set((state) => ({
            menus: state.menus.map((menu, index) =>
              index === existingMenuIndex ? newMenu : menu
            ),
          }));
        } else {
          set((state) => ({
            menus: [...state.menus, newMenu],
          }));
        }
      },
      
      getDailyMenu: (date: string) => {
        const menu = get().menus.find((menu) => menu.date === date);
        return menu || null;
      },
    }),
    {
      name: 'lunch-menu-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);