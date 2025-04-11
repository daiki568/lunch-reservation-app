import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import DatePicker from '@/components/DatePicker';
import ReservationItem from '@/components/ReservationItem';
import Button from '@/components/Button';
import { useReservationStore } from '@/store/reservation-store';
import Colors from '@/constants/colors';
import { User } from 'lucide-react-native';

export default function AdminReservationsScreen() {
  const router = useRouter();
  const { getReservationsByDate, togglePaymentStatus, deleteReservation } = useReservationStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const reservations = getReservationsByDate(selectedDate);
  
  const handleTogglePayment = (id: string) => {
    togglePaymentStatus(id);
  };
  
  const handleDeleteReservation = (id: string) => {
    Alert.alert(
      '予約削除',
      'この予約を削除してもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteReservation(id),
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header title="予約・決済管理" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.sectionTitle}>日付選択</Text>
          <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </View>
        
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>予約一覧</Text>
            <Text style={styles.reservationCount}>
              {reservations.length}件の予約
            </Text>
          </View>
          
          {reservations.length > 0 ? (
            <FlatList
              data={reservations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ReservationItem
                  reservation={item}
                  onTogglePayment={handleTogglePayment}
                  onDelete={handleDeleteReservation}
                />
              )}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <User size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>
                {selectedDate === new Date().toISOString().split('T')[0]
                  ? '本日の予約はまだありません'
                  : 'この日の予約はありません'}
              </Text>
            </View>
          )}
        </View>
        
        <Button
          title="管理画面に戻る"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
        />
      </View>
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
    padding: 20,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reservationCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 16,
  },
});