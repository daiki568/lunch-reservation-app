import { Redirect } from 'expo-router';

export default function Index() {
  // リダイレクト先を予約画面に変更
  return <Redirect href="/(tabs)/reservation" />;
}