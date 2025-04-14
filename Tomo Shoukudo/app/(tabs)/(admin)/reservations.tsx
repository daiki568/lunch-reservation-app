import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useReservationStore } from '@/store/reservation-store';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ReservationItem from '@/components/ReservationItem';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorMessage from '@/components/ErrorMessage';
import { getTodayDate, formatDateWithDay } from '@/utils/date-utils';
import { Calendar, Search, RefreshCw, Download, Share } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function ReservationsScreen() {
  const { 
    reservations, 
    loading, 
    error, 
    fetchReservations, 
    updatePaymentStatus, 
    deleteReservation,
    clearError
  } = useReservationStore();
  
  const [searchDate, setSearchDate] = useState(getTodayDate());
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
  });

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    if (reservations) {
      const total = reservations.length;
      const paid = reservations.filter(r => r.isPaid).length;
      setStats({
        total,
        paid,
        unpaid: total - paid,
      });
    }
  }, [reservations]);

  const loadReservations = async () => {
    await fetchReservations(searchDate);
  };

  const handleSearch = () => {
    loadReservations();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    await loadReservations();
    setRefreshing(false);
  };

  const handleTogglePayment = async (id: string, isPaid: boolean) => {
    await updatePaymentStatus(id, isPaid);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      '削除確認',
      'この予約を削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          onPress: () => deleteReservation(id),
          style: 'destructive',
        },
      ]
    );
  };

  // 予約データをCSV形式でエクスポート（デモ機能）
  const exportReservations = () => {
    if (reservations.length === 0) {
      Alert.alert('エクスポートエラー', '予約データがありません。');
      return;
    }

    try {
      // CSVヘッダー
      let csv = '名前,部屋番号,日付,支払い状況\n';
      
      // データ行
      reservations.forEach(r => {
        csv += `${r.name},${r.roomNumber},${r.date},${r.isPaid ? '支払い済み' : '未払い'}\n`;
      });
      
      // Web環境ではダウンロード、ネイティブ環境では共有機能をシミュレート
      if (Platform.OS === 'web') {
        Alert.alert(
          'エクスポート成功',
          'CSVデータが生成されました。実際のアプリではダウンロードが開始されます。'
        );
      } else {
        Alert.alert(
          '共有',
          'CSVデータが生成されました。実際のアプリでは共有オプションが表示されます。'
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('エクスポートエラー', 'データのエクスポートに失敗しました。');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <ErrorMessage message={error} />

        <View style={styles.searchContainer}>
          <Input
            label="日付で検索"
            placeholder="YYYY-MM-DD (例: 2023-06-15)"
            value={searchDate}
            onChangeText={setSearchDate}
            containerStyle={styles.searchInput}
          />
          <Button
            title="検索"
            onPress={handleSearch}
            style={styles.searchButton}
            icon={<Search size={18} color={Colors.white} />}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>予約状況</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={exportReservations}
                disabled={reservations.length === 0}
              >
                <Download size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>合計</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {stats.paid}
              </Text>
              <Text style={styles.statLabel}>支払い済み</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.error }]}>
                {stats.unpaid}
              </Text>
              <Text style={styles.statLabel}>未払い</Text>
            </View>
          </View>
        </View>

        <View style={styles.reservationsContainer}>
          <Text style={styles.sectionTitle}>
            {formatDateWithDay(searchDate)}の予約一覧
          </Text>
          
          {reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Calendar size={40} color={Colors.primaryLight} />
              <Text style={styles.emptyText}>
                予約はありません
              </Text>
            </View>
          ) : (
            reservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onTogglePayment={handleTogglePayment}
                onDelete={handleDelete}
              />
            ))
          )}
        </View>
        
        {/* 追加のスペースでスクロールを確保 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <LoadingOverlay visible={loading && !refreshing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // 下部に余白を追加
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchButton: {
    marginLeft: 12,
    height: 48,
  },
  statsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reservationsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40, // スクロール時の余白
  },
});