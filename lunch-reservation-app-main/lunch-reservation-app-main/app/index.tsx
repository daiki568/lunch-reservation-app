import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import MenuDisplay from '@/components/MenuDisplay';
import { useMenuStore } from '@/store/menu-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { User, Settings } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const { getDailyMenu } = useMenuStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayMenu = getDailyMenu(today);
  
  const handleUserReservation = () => {
    router.push('/user/reservation');
  };
  
  const handleAdminAccess = () => {
    if (isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>昼食予約</Text>
        <Text style={styles.subtitle}>シンプルな予約システム</Text>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>本日のメニュー</Text>
        <MenuDisplay menu={todayMenu} date={today} />
      </View>
      
      <View style={styles.actionsContainer}>
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <User size={32} color={Colors.primary} />
            <Text style={styles.actionTitle}>予約する</Text>
            <Text style={styles.actionDescription}>
              名前と電話番号を入力して昼食を予約
            </Text>
            <Button
              title="予約フォームへ"
              onPress={handleUserReservation}
              style={styles.actionButton}
            />
          </View>
        </Card>
        
        <Card style={styles.actionCard}>
          <View style={styles.actionContent}>
            <Settings size={32} color={Colors.primary} />
            <Text style={styles.actionTitle}>管理者</Text>
            <Text style={styles.actionDescription}>
              メニュー設定・予約確認・決済管理
            </Text>
            <Button
              title={isAdmin ? "管理画面へ" : "管理者ログイン"}
              onPress={handleAdminAccess}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 16,
  },
  actionCard: {
    padding: 20,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    width: '100%',
  },
});