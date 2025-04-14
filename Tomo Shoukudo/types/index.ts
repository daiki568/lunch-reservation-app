export interface Reservation {
  id?: string;
  name: string;
  roomNumber: string;
  date: string;
  isPaid: boolean;
  createdAt: number;
}

export interface Menu {
  id?: string;
  date: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface User {
  isAdmin: boolean;
}