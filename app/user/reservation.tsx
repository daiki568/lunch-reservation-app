
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMenuStore } from '../../store/menu-store';
import { useReservationStore } from '../../store/reservation-store';
import Input from '../../components/Input';
import Button from '../../components/Button';
import MenuDisplay from '../../components/MenuDisplay';

const postReservationToSheets = async (reservation) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwuY5RuExtToWAOStbAnYHqey8Us4h0B-8wLU0k4p-DQnNjNc7b79esFFYofr228WX0/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'reservation', ...reservation }),
    });
    const result = await response.text();
    console.log('予約送信結果:', result);
  } catch (error) {
    console.error('予約送信エラー:', error);
  }
};

export default function ReservationPage() {
  const router = useRouter();
  const { getDailyMenu } = useMenuStore();
  const { addReservation } = useReservationStore();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayMenu = getDailyMenu(today);

  const handleSubmit = async () => {
    if (!name || !roomNumber) return alert('名前と部屋番号を入力してください。');

    const reservationId = addReservation(name, roomNumber);
    const reservation = {
      id: reservationId,
      name,
      roomNumber,
      date: today,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    await postReservationToSheets(reservation);
    setIsSubmitting(false);
    router.push(`/user/confirmation?id=${reservationId}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>昼食予約</h1>
      <MenuDisplay menu={todayMenu} date={today} />

      <Input label="お名前" value={name} onChange={setName} placeholder="山田 太郎" />
      <Input label="部屋番号" value={roomNumber} onChange={setRoomNumber} placeholder="101" />

      <Button title="予約する" onClick={handleSubmit} disabled={isSubmitting} />
    </div>
  );
}
