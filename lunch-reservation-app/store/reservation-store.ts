import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reservation } from '@/types';

interface ReservationState {
  reservations: Reservation[];
  addReservation: (name: string, roomNumber: string) => string; // Changed from phone to roomNumber
  togglePaymentStatus: (id: string) => void;
  getReservationsByDate: (date: string) => Reservation[];
  deleteReservation: (id: string) => void;
}

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: [],
      
      addReservation: (name: string, roomNumber: string) => { // Changed from phone to roomNumber
        const id = Date.now().toString();
        const today = new Date().toISOString().split('T')[0];
        
        const newReservation: Reservation = {
          id,
          name,
          roomNumber, // Changed from phone to roomNumber
          date: today,
          isPaid: false,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          reservations: [...state.reservations, newReservation],
        }));
        
        return id;
      },
      
      togglePaymentStatus: (id: string) => {
        set((state) => ({
          reservations: state.reservations.map((reservation) =>
            reservation.id === id
              ? { ...reservation, isPaid: !reservation.isPaid }
              : reservation
          ),
        }));
      },
      
      getReservationsByDate: (date: string) => {
        return get().reservations.filter(
          (reservation) => reservation.date === date
        );
      },
      
      deleteReservation: (id: string) => {
        set((state) => ({
          reservations: state.reservations.filter(
            (reservation) => reservation.id !== id
          ),
        }));
      },
    }),
    {
      name: 'lunch-reservation-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);