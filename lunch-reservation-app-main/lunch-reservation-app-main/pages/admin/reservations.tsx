import { useReservationStore } from '../../store/reservation-store';

export default function AdminReservationsPage() {
  const { reservations, togglePaymentStatus, deleteReservation } = useReservationStore();

  return (
    <div style={{ padding: 24 }}>
      <h1>全予約一覧</h1>

      {reservations.length === 0 ? (
        <p>予約はまだありません。</p>
      ) : (
        <table border={1} cellPadding={8} style={{ marginTop: 24, width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>名前</th>
              <th>部屋番号</th>
              <th>日付</th>
              <th>支払い</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.name}</td>
                <td>{res.roomNumber}</td>
                <td>{res.date}</td>
                <td>{res.isPaid ? '済' : '未'}</td>
                <td>
                  <button onClick={() => togglePaymentStatus(res.id)}>支払い切替</button>{' '}
                  <button onClick={() => deleteReservation(res.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
