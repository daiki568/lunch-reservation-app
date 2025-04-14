import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Utensils, CalendarClock, Settings } from 'lucide-react-native';

export default function AdminScreen() {
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      router.replace('/profile');
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      <Text style={styles.title}>管理者メニュー</Text>
      <Text style={styles.subtitle}>
        メニューの管理や予約の確認ができます
      </Text>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(admin)/menu-management')}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 101, 114, 0.1)' }]}>
            <Utensils size={24} color={Colors.primary} />
          </View>
          <Text style={styles.menuItemTitle}>メニュー管理</Text>
          <Text style={styles.menuItemDescription}>
            日替わりメニューの登録・編集
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(admin)/reservations')}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(249, 170, 51, 0.1)' }]}>
            <CalendarClock size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.menuItemTitle}>予約一覧</Text>
          <Text style={styles.menuItemDescription}>
            予約状況の確認と支払い管理
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Settings size={20} color={Colors.primary} />
          <Text style={styles.infoTitle}>管理者情報</Text>
        </View>
        <Text style={styles.infoText}>
          • メニューは前日までに登録してください。
        </Text>
        <Text style={styles.infoText}>
          • 予約状況は随時更新されます。
        </Text>
        <Text style={styles.infoText}>
          • 支払い状況は予約一覧から管理できます。
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  menuItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40, // スクロール時の余白
  },
});