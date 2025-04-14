import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { Alert, Platform } from 'react-native';

// Firebase configuration
// 注意: 実際のプロジェクトでは、環境変数や安全な方法でAPIキーを管理してください
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "lunch-reservation-app.firebaseapp.com",
  projectId: "lunch-reservation-app",
  storageBucket: "lunch-reservation-app.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
let app;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  if (Platform.OS !== 'web') {
    Alert.alert(
      "接続エラー",
      "データベースへの接続に失敗しました。ネットワーク接続を確認してください。"
    );
  }
}

export { db };