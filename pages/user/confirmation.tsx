import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ padding: 24 }}>
      <h1>予約完了</h1>
      <p>予約ID: <strong>{id}</strong></p>
      <p>ご予約ありがとうございます！</p>

      <div style={{ marginTop: 24 }}>
        <Link href="/">
          <button>ホームへ戻る</button>
        </Link>
      </div>
    </div>
  );
}
