import { useEffect, useState } from 'react';
import { useReservationStore } from '../../store/reservation-store';

export default function AdminDashboardPage() {
  const { reservations } = useReservationStore();
  const [today, setToday] = useState('');

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0];
    setToday(date);
  }, []);

  const todayReservations = reservations.filter(
    (res) => res.date === today
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>管理者ダッシュボード</h1>
      <h2 style={{ marginTop: 24 }}>本日の予約一覧</h2>

      {todayReservations.length === 0 ? (
        <p>本日の予約はまだありません。</p>
      ) : (
        <ul>
          {todayReservations.map((res) => (
            <li key={res.id} style={{ marginBottom: 12 }}>
              <strong>{res.name}</strong>（部屋 {res.roomNumber}） - 支払い:
              {res.isPaid ? '済' : '未'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
