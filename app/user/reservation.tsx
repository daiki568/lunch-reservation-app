import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import MenuDisplay from '@/components/MenuDisplay';
import { useMenuStore } from '@/store/menu-store';
import { useReservationStore } from '@/store/reservation-store';
import Colors from '@/constants/colors';

const postReservationToSheets = async (reservation: {
  id: string;
  name: string;
  roomNumber: string;
  date: string;
  isPaid: boolean;
  createdAt: string;
}) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxXbJ7ZhLK3vfIADIFKrz-hWUgpGTiAcx7QM5CWvDPsMwyYYhhPgyPpswe7p16Y_fWM/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    });

    const result = await response.json();
    console.log('Google Sheetsへの保存結果:', result);
  } catch (error) {
    console.error('Google Sheetsへの送信失敗:', error);
  }
};

export default function ReservationScreen() {
  const router = useRouter();
  const { getDailyMenu } = useMenuStore();
  const { addReservation } = useReservationStore();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [errors, setErrors] = useState({ name: '', roomNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayMenu = getDailyMenu(today);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', roomNumber: '' };

    if (!name.trim()) {
      newErrors.name = 'お名前を入力してください';
      isValid = false;
    }

    if (!roomNumber.trim()) {
      newErrors.roomNumber = '部屋番号を入力してください';
      isValid = false;
    } else if (!/^
{1,4}$/.test(roomNumber.trim())) {
      newErrors.roomNumber = '有効な部屋番号を入力してください';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (!todayMenu) {
      Alert.alert(
        '予約できません',
        '本日のメニューがまだ設定されていません。後ほど再度お試しください。'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationId = addReservation(name, roomNumber);
      const reservation = {
        id: reservationId,
        name,
        roomNumber,
        date: today,
        isPaid: false,
        createdAt: new Date().toISOString(),
      };

      postReservationToSheets(reservation);

      router.push({
        pathname: '/user/confirmation',
        params: { id: reservationId },
      });
    } catch (error) {
      Alert.alert('エラー', '予約の処理中にエラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header title="昼食予約" showBackButton />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>本日のメニュー</Text>
        <MenuDisplay menu={todayMenu} date={today} />

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>予約情報</Text>

          <Input
            label="お名前"
            value={name}
            onChangeText={setName}
            placeholder="山田 太郎"
            error={errors.name}
            style={styles.input}
          />

          <Input
            label="部屋番号"
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholder="例: 101"
            keyboardType="number-pad"
            error={errors.roomNumber}
            style={styles.input}
          />

          <Button
            title="予約する"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!todayMenu}
            style={styles.submitButton}
          />

          {!todayMenu && (
            <Text style={styles.noMenuWarning}>
              本日のメニューがまだ設定されていません。予約はできません。
            </Text>
          )}
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  formContainer: {
    marginTop: 24,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  noMenuWarning: {
    marginTop: 16,
    color: Colors.error,
    textAlign: 'center',
    fontSize: 14,
  },
});
