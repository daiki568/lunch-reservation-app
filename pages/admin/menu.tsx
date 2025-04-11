import { useState } from 'react';
import { useMenuStore } from '../../store/menu-store';

export default function AdminMenuPage() {
  const { setDailyMenu, getDailyMenu } = useMenuStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const existingMenu = getDailyMenu(today);

  const handleSubmit = () => {
    if (!name || !description || !price) {
      alert('すべての項目を入力してください。');
      return;
    }

    setDailyMenu({
      id: Date.now().toString(),
      date: today,
      name,
      description,
      price: parseFloat(price),
    });

    setSubmitted(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>メニュー設定</h1>

      {existingMenu && submitted ? (
        <div style={{ marginTop: 24 }}>
          <h2>本日のメニュー</h2>
          <p><strong>{existingMenu.name}</strong></p>
          <p>{existingMenu.description}</p>
          <p>価格: ¥{existingMenu.price}</p>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <label>
            メニュー名：
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
          <br /><br />

          <label>
            説明：
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: '100%' }}
            />
          </label>
          <br /><br />

          <label>
            価格（円）：
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
          <br /><br />

          <button onClick={handleSubmit}>メニューを登録</button>
        </div>
      )}
    </div>
  );
}
