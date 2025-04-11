import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import MenuDisplay from '@/components/MenuDisplay';
import { useMenuStore } from '@/store/menu-store';
import { useReservationStore } from '@/store/reservation-store';
import Colors from '@/constants/colors';
import { Check } from 'lucide-react-native';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDailyMenu } = useMenuStore();
  const { reservations } = useReservationStore();
  
  const [reservation, setReservation] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const found = reservations.find(r => r.id === id);
      setReservation(found);
    }
  }, [id, reservations]);
  
  const today = new Date().toISOString().split('T')[0];
  const todayMenu = getDailyMenu(today);
  
  const handleBackToHome = () => {
    router.replace('/');
  };
  
  if (!reservation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Header title="予約確認" showBackButton />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>予約情報が見つかりませんでした</Text>
          <Button title="ホームに戻る" onPress={handleBackToHome} style={styles.button} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header title="予約確認" />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.successContainer}>
          <View style={styles.checkCircle}>
            <Check size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>予約が完了しました</Text>
          <Text style={styles.successMessage}>
            ご予約ありがとうございます。以下の情報をご確認ください。
          </Text>
        </View>
        
        <Card style={styles.reservationCard}>
          <Text style={styles.cardTitle}>予約情報</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>お名前</Text>
            <Text style={styles.infoValue}>{reservation.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>部屋番号</Text>
            <Text style={styles.infoValue}>{reservation.roomNumber}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>予約日</Text>
            <Text style={styles.infoValue}>
              {new Date(reservation.date).toLocaleDateString('ja-JP')}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>予約時間</Text>
            <Text style={styles.infoValue}>
              {new Date(reservation.createdAt).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>支払い状況</Text>
            <View style={styles.paymentStatus}>
              <Text style={styles.paymentText}>
                {reservation.isPaid ? '支払済' : '未払い（当日お支払いください）'}
              </Text>
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>注文内容</Text>
        <MenuDisplay menu={todayMenu} date={today} />
        
        <Button
          title="ホームに戻る"
          onPress={handleBackToHome}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  reservationCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  paymentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: Colors.pending + '20', // 20% opacity
  },
  paymentText: {
    fontSize: 12,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  homeButton: {
    marginTop: 32,
    marginBottom: 16,
  },
});