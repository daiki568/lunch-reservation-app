import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Lock, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { isAdmin, login, logout } = useAuthStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }

    const success = login(password);
    if (!success) {
      setError('パスワードが正しくありません');
    } else {
      setPassword('');
      setError('');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      '管理者モードからログアウトしますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          onPress: () => logout(),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <View style={styles.card}>
        {isAdmin ? (
          <>
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>管理者モード</Text>
            </View>
            <Text style={styles.title}>管理者としてログイン中</Text>
            <Text style={styles.description}>
              管理者モードでは、メニューの管理や予約の確認ができます。
            </Text>
            <Button
              title="ログアウト"
              onPress={handleLogout}
              variant="outline"
              style={styles.button}
              icon={<LogOut size={18} color={Colors.primary} />}
            />
          </>
        ) : (
          <>
            <Text style={styles.title}>管理者ログイン</Text>
            <Text style={styles.description}>
              管理者パスワードを入力してください。
            </Text>
            <Input
              label="パスワード"
              placeholder="管理者パスワードを入力"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error}
              containerStyle={styles.inputContainer}
            />
            <Button
              title="ログイン"
              onPress={handleLogin}
              style={styles.button}
              icon={<Lock size={18} color={Colors.white} />}
            />
          </>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>アプリについて</Text>
        <Text style={styles.infoVersion}>バージョン 1.0.0</Text>
        <Text style={styles.infoText}>
          このアプリは昼食の予約管理のために開発されました。
        </Text>
      </View>
      
      {/* 追加のスペースでスクロールを確保 */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  adminBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  adminBadgeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  infoVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40, // スクロール時の余白
  },
});