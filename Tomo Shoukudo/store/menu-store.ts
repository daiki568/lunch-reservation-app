import { create } from 'zustand';
import { Menu } from '@/types';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface MenuState {
  todayMenu: Menu | null;
  allMenus: Menu[];
  loading: boolean;
  error: string | null;
  fetchTodayMenu: (date: string) => Promise<void>;
  fetchAllMenus: () => Promise<void>;
  addMenu: (menu: Omit<Menu, 'id'>) => Promise<boolean>;
  updateMenu: (id: string, menuUpdates: Partial<Omit<Menu, 'id'>>) => Promise<boolean>;
  deleteMenu: (id: string) => Promise<boolean>;
  clearError: () => void;
}

// モックデータ（オフライン/デモ用）
const mockMenus: Menu[] = [
  {
    id: 'mock1',
    date: new Date().toISOString().split('T')[0],
    name: '本日のランチセット',
    description: '季節の野菜と国産牛肉を使用した特製ハンバーグ定食です。サラダ、スープ、ライス付き。',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mock2',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 明日
    name: '明日の特製パスタランチ',
    description: '自家製トマトソースと新鮮な魚介を使ったシーフードパスタです。サラダとパン付き。',
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export const useMenuStore = create<MenuState>((set, get) => ({
  todayMenu: null,
  allMenus: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchTodayMenu: async (date) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合はモックデータを使用
      if (!db) {
        console.log("Using mock data for today's menu");
        const mockTodayMenu = mockMenus.find(m => m.date === date) || null;
        set({ todayMenu: mockTodayMenu, loading: false });
        return;
      }

      const q = query(
        collection(db, 'menus'),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      let todayMenu: Menu | null = null;
      
      querySnapshot.forEach((doc) => {
        todayMenu = { id: doc.id, ...doc.data() } as Menu;
      });
      
      set({ todayMenu, loading: false });
    } catch (error) {
      console.error('Error fetching today menu:', error);
      // Firebaseエラー時はモックデータを表示
      const mockTodayMenu = mockMenus.find(m => m.date === date) || null;
      set({ 
        error: 'メニューの取得に失敗しました。ネットワーク接続を確認してください。', 
        loading: false,
        todayMenu: mockTodayMenu
      });
    }
  },

  fetchAllMenus: async () => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合はモックデータを使用
      if (!db) {
        console.log("Using mock data for all menus");
        set({ allMenus: [...mockMenus], loading: false });
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'menus'));
      const menus: Menu[] = [];
      
      querySnapshot.forEach((doc) => {
        menus.push({ id: doc.id, ...doc.data() } as Menu);
      });
      
      set({ allMenus: menus, loading: false });
    } catch (error) {
      console.error('Error fetching all menus:', error);
      // Firebaseエラー時はモックデータを表示
      set({ 
        error: 'メニューの取得に失敗しました。ネットワーク接続を確認してください。', 
        loading: false,
        allMenus: [...mockMenus]
      });
    }
  },

  addMenu: async (menu) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, using mock data");
        // 既存のメニューをチェック（デモ用）
        const existingMenu = mockMenus.find(m => m.date === menu.date);
        if (existingMenu) {
          set({ error: 'この日付のメニューは既に存在します。', loading: false });
          return false;
        }
        
        // モックデータに追加
        const newMenu = {
          ...menu,
          id: `mock${Date.now()}`
        };
        
        mockMenus.push(newMenu);
        
        // 今日のメニューを更新
        if (menu.date === new Date().toISOString().split('T')[0]) {
          set({ todayMenu: newMenu });
        }
        
        set({ 
          allMenus: [...mockMenus],
          loading: false 
        });
        
        return true;
      }
      
      // Check if a menu already exists for this date
      const q = query(
        collection(db, 'menus'),
        where('date', '==', menu.date)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        set({ error: 'この日付のメニューは既に存在します。', loading: false });
        return false;
      }
      
      await addDoc(collection(db, 'menus'), menu);
      await get().fetchAllMenus();
      if (menu.date === new Date().toISOString().split('T')[0]) {
        await get().fetchTodayMenu(menu.date);
      }
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error adding menu:', error);
      set({ error: 'メニューの追加に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },

  updateMenu: async (id, menuUpdates) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, updating mock data");
        // モックデータを更新（デモ用）
        const updatedMocks = mockMenus.map(menu => 
          menu.id === id ? { ...menu, ...menuUpdates } : menu
        );
        
        mockMenus.splice(0, mockMenus.length, ...updatedMocks);
        
        // 今日のメニューを更新
        const updatedMenu = mockMenus.find(m => m.id === id);
        if (get().todayMenu?.id === id && updatedMenu) {
          set({ todayMenu: updatedMenu });
        }
        
        set({ 
          allMenus: [...mockMenus],
          loading: false 
        });
        
        return true;
      }
      
      const menuRef = doc(db, 'menus', id);
      await updateDoc(menuRef, menuUpdates);
      
      // Update local state
      if (get().todayMenu?.id === id) {
        const currentMenu = get().todayMenu as Menu;
        const updatedMenu = { ...currentMenu, ...menuUpdates } as Menu;
        set({ todayMenu: updatedMenu });
      }
      
      const updatedMenus = get().allMenus.map(m => 
        m.id === id ? { ...m, ...menuUpdates } : m
      );
      
      set({ allMenus: updatedMenus, loading: false });
      return true;
    } catch (error) {
      console.error('Error updating menu:', error);
      set({ error: 'メニューの更新に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, deleting from mock data");
        // モックデータから削除（デモ用）
        const filteredMocks = mockMenus.filter(menu => menu.id !== id);
        
        mockMenus.splice(0, mockMenus.length, ...filteredMocks);
        
        // 今日のメニューを更新
        if (get().todayMenu?.id === id) {
          set({ todayMenu: null });
        }
        
        set({ 
          allMenus: [...mockMenus],
          loading: false 
        });
        
        return true;
      }
      
      await deleteDoc(doc(db, 'menus', id));
      
      // Update local state
      if (get().todayMenu?.id === id) {
        set({ todayMenu: null });
      }
      
      const updatedMenus = get().allMenus.filter(menu => menu.id !== id);
      set({ allMenus: updatedMenus, loading: false });
      return true;
    } catch (error) {
      console.error('Error deleting menu:', error);
      set({ error: 'メニューの削除に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },
}));