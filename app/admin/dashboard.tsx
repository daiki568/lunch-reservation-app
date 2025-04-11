import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useAuthStore } from '@/store/auth-store';
import { useReservationStore } from '@/store/reservation-store';
import { useMenuStore } from '@/store/menu-store';
import Colors from '@/constants/colors';
import { LogOut, Utensils, User, CreditCard } from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { reservations } = useReservationStore();
  const { menus } = useMenuStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(r => r.date === today);
  const todayMenu = menus.find(m => m.date === today);
  
  const handleLogout = () => {
  const confirmed = window.confirm('管理者モードからログアウトしますか？');
  if (confirmed) {
    logout();
    router.replace('/');
  }
};

  const navigateToMenu = () => {
    router.push('/admin/menu');
  };
  
  const navigateToReservations = () => {
    router.push('/admin/reservations');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header
        title="管理者ダッシュボード"
        rightComponent={
          <Button
            title="ログアウト"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        }
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <User size={24} color={Colors.primary} />
              </View>
              <Text style={styles.summaryValue}>{todayReservations.length}</Text>
              <Text style={styles.summaryLabel}>本日の予約</Text>
            </View>
          </Card>
          
          <Card style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <CreditCard size={24} color={Colors.primary} />
              </View>
              <Text style={styles.summaryValue}>
                {todayReservations.filter(r => r.isPaid).length}/{todayReservations.length}
              </Text>
              <Text style={styles.summaryLabel}>支払い済み</Text>
            </View>
          </Card>
        </View>
        
        <Text style={styles.sectionTitle}>管理メニュー</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <View style={styles.menuCardIcon}>
              <Utensils size={24} color={Colors.primary} />
            </View>
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>メニュー管理</Text>
              <Text style={styles.menuCardDescription}>
                {todayMenu
                  ? `本日のメニュー: ${todayMenu.name}`
                  : '本日のメニューは未設定です'}
              </Text>
            </View>
            <Button
              title="設定"
              onPress={navigateToMenu}
              variant="outline"
              style={styles.menuCardButton}
            />
          </View>
        </Card>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuCardContent}>
            <View style={styles.menuCardIcon}>
              <User size={24} color={Colors.primary} />
            </View>
            <View style={styles.menuCardInfo}>
              <Text style={styles.menuCardTitle}>予約・決済管理</Text>
              <Text style={styles.menuCardDescription}>
                {todayReservations.length > 0
                  ? `本日の予約: ${todayReservations.length}件`
                  : '本日の予約はありません'}
              </Text>
            </View>
            <Button
              title="確認"
              onPress={navigateToReservations}
              variant="outline"
              style={styles.menuCardButton}
            />
          </View>
        </Card>
        
        <Button
          title="ホームに戻る"
          onPress={() => router.push('/')}
          variant="secondary"
          style={styles.homeButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  logoutButtonText: {
    fontSize: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  summaryContent: {
    alignItems: 'center',
    padding: 8,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuCardInfo: {
    flex: 1,
  },
  menuCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  menuCardDescription: {
    fontSize: 14,
    color: Colors.textLight,
  },
  menuCardButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  homeButton: {
    marginTop: 16,
    marginBottom: 24,
  },
});
