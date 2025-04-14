import { create } from 'zustand';
import { Reservation } from '@/types';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Platform } from 'react-native';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  fetchReservations: (date?: string) => Promise<void>;
  addReservation: (reservation: Omit<Reservation, 'id' | 'isPaid' | 'createdAt'>) => Promise<boolean>;
  updatePaymentStatus: (id: string, isPaid: boolean) => Promise<boolean>;
  deleteReservation: (id: string) => Promise<boolean>;
  clearError: () => void;
}

// モックデータ（オフライン/デモ用）
const mockReservations: Reservation[] = [
  {
    id: 'mock1',
    name: '山田 太郎',
    roomNumber: '101',
    date: new Date().toISOString().split('T')[0],
    isPaid: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'mock2',
    name: '佐藤 花子',
    roomNumber: '202',
    date: new Date().toISOString().split('T')[0],
    isPaid: true,
    createdAt: Date.now() - 7200000
  }
];

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchReservations: async (date) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合はモックデータを使用
      if (!db) {
        console.log("Using mock data for reservations");
        const filteredMocks = date 
          ? mockReservations.filter(r => r.date === date)
          : mockReservations;
        
        set({ 
          reservations: filteredMocks, 
          loading: false 
        });
        return;
      }

      let q;
      if (date) {
        q = query(
          collection(db, 'reservations'),
          where('date', '==', date),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'reservations'),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const reservations: Reservation[] = [];
      
      querySnapshot.forEach((doc) => {
        reservations.push({ id: doc.id, ...doc.data() } as Reservation);
      });
      
      set({ reservations, loading: false });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      set({ 
        error: 'データの取得に失敗しました。ネットワーク接続を確認してください。', 
        loading: false,
        // Firebaseエラー時はモックデータを表示
        reservations: date 
          ? mockReservations.filter(r => r.date === date)
          : mockReservations
      });
    }
  },

  addReservation: async (reservation) => {
    set({ loading: true, error: null });
    try {
      const newReservation = {
        ...reservation,
        isPaid: false,
        createdAt: Date.now(),
      };
      
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, using mock data");
        // モックデータに追加（デモ用）
        mockReservations.unshift({
          ...newReservation,
          id: `mock${Date.now()}`,
        });
        
        set({ 
          reservations: mockReservations.filter(r => r.date === reservation.date),
          loading: false 
        });
        
        return true;
      }
      
      await addDoc(collection(db, 'reservations'), {
        ...newReservation,
        // サーバータイムスタンプを使用（可能な場合）
        serverCreatedAt: serverTimestamp()
      });
      
      await get().fetchReservations(reservation.date);
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Error adding reservation:', error);
      set({ error: '予約の追加に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },

  updatePaymentStatus: async (id, isPaid) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, updating mock data");
        // モックデータを更新（デモ用）
        const updatedMocks = mockReservations.map(reservation => 
          reservation.id === id ? { ...reservation, isPaid } : reservation
        );
        
        mockReservations.splice(0, mockReservations.length, ...updatedMocks);
        
        set({ 
          reservations: [...mockReservations],
          loading: false 
        });
        
        return true;
      }
      
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, { isPaid });
      
      // Update local state
      const updatedReservations = get().reservations.map(reservation => 
        reservation.id === id ? { ...reservation, isPaid } : reservation
      );
      
      set({ reservations: updatedReservations, loading: false });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      set({ error: '支払い状況の更新に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },

  deleteReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      // Firebaseが利用できない場合
      if (!db) {
        console.log("Firebase unavailable, deleting from mock data");
        // モックデータから削除（デモ用）
        const filteredMocks = mockReservations.filter(
          reservation => reservation.id !== id
        );
        
        mockReservations.splice(0, mockReservations.length, ...filteredMocks);
        
        set({ 
          reservations: [...mockReservations],
          loading: false 
        });
        
        return true;
      }
      
      await deleteDoc(doc(db, 'reservations', id));
      
      // Update local state
      const updatedReservations = get().reservations.filter(
        reservation => reservation.id !== id
      );
      
      set({ reservations: updatedReservations, loading: false });
      return true;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      set({ error: '予約の削除に失敗しました。ネットワーク接続を確認してください。', loading: false });
      return false;
    }
  },
}));