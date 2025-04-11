import { useState } from 'react';
import { useRouter } from 'next/router';
import MenuDisplay from '../../components/MenuDisplay';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useMenuStore } from '../../store/menu-store';
import { useReservationStore } from '../../store/reservation-store';

export default function ReservationPage() {
  const router = useRouter();
  const { getDailyMenu } = useMenuStore();
  const { addReservation } = useReservationStore();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [errors, setErrors] = useState({ name: '', roomNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayMenu = getDailyMenu(today);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', roomNumber: '' };

    if (!name.trim()) {
      newErrors.name = 'お名前を入力してください';
      isValid = false;
    }

    if (!roomNumber.trim()) {
      newErrors.roomNumber = '部屋番号を入力してください';
      isValid = false;
    } else if (!/^\d{1,4}$/.test(roomNumber.trim())) {
      newErrors.roomNumber = '有効な部屋番号を入力してください';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (!todayMenu) {
      alert('本日のメニューがまだ設定されていません。後ほど再度お試しください。');
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationId = addReservation(name, roomNumber);
      router.push(`/user/confirmation?id=${reservationId}`);
    } catch (error) {
      alert('予約の処理中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>昼食予約</h1>

      <h2 style={{ marginTop: 24 }}>本日のメニュー</h2>
      <MenuDisplay menu={todayMenu} date={today} />

      <div style={{ marginTop: 24 }}>
        <h2>予約情報</h2>

        <Input
          label="お名前"
          value={name}
          onChange={setName}
          placeholder="山田 太郎"
          error={errors.name}
        />

        <Input
          label="部屋番号"
          value={roomNumber}
          onChange={setRoomNumber}
          placeholder="例: 101"
          type="number"
          error={errors.roomNumber}
        />

        <Button
          title="予約する"
          onClick={handleSubmit}
          disabled={isSubmitting || !todayMenu}
        />

        {!todayMenu && (
          <p style={{ color: 'red', marginTop: 16 }}>
            本日のメニューがまだ設定されていません。予約はできません。
          </p>
        )}
      </div>
    </div>
  );
}
