export interface Reservation {
  id: string;
  name: string;
  roomNumber: string; // Changed from phone to roomNumber
  date: string; // ISO形式の日付
  isPaid: boolean;
  createdAt: string; // ISO形式の日付
}

export interface DailyMenu {
  id: string;
  date: string; // ISO形式の日付
  name: string;
  description: string;
  price: number;
}