import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useMenuStore } from '@/store/menu-store';
import { useReservationStore } from '@/store/reservation-store';
import Colors from '@/constants/colors';
import { getTodayDate, formatDateWithDay } from '@/utils/date-utils';
import MenuCard from '@/components/MenuCard';
import Input from '@/components/Input';
import Button from '@/components/Button';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorMessage from '@/components/ErrorMessage';
import { CalendarClock, CheckCircle, RefreshCw, Utensils } from 'lucide-react-native';

export default function ReservationScreen() {
  const { todayMenu, loading: menuLoading, error: menuError, fetchTodayMenu, clearError: clearMenuError } = useMenuStore();
  const { 
    addReservation, 
    loading: reservationLoading, 
    error: reservationError,
    clearError: clearReservationError 
  } = useReservationStore();
  
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [roomNumberError, setRoomNumberError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const today = getTodayDate();
  const loading = menuLoading || reservationLoading;
  const error = menuError || reservationError;

  useEffect(() => {
    fetchTodayMenu(today);
  }, []);

  const handleRefresh = () => {
    clearMenuError();
    clearReservationError();
    fetchTodayMenu(today);
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('名前を入力してください');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!roomNumber.trim()) {
      setRoomNumberError('部屋番号を入力してください');
      isValid = false;
    } else {
      setRoomNumberError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!todayMenu) {
      Alert.alert('エラー', '今日のメニューがまだ登録されていません');
      return;
    }

    const success = await addReservation({
      name,
      roomNumber,
      date: today,
    });

    if (success) {
      setSuccess(true);
      setName('');
      setRoomNumber('');
      
      // 3秒後に成功メッセージを非表示にする
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.dateText}>{formatDateWithDay(today)}</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ErrorMessage message={error} />

        {success && (
          <View style={styles.successContainer}>
            <CheckCircle size={24} color={Colors.success} />
            <Text style={styles.successText}>予約が完了しました！</Text>
          </View>
        )}

        {!menuLoading && !todayMenu ? (
          <View style={styles.emptyContainer}>
            <CalendarClock size={60} color={Colors.primaryLight} />
            <Text style={styles.emptyText}>
              今日のメニューはまだ登録されていません
            </Text>
          </View>
        ) : (
          todayMenu && (
            <>
              <Text style={styles.sectionTitle}>今日のメニュー</Text>
              <MenuCard menu={todayMenu} />
            </>
          )
        )}

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>予約情報</Text>
          
          <Input
            label="お名前"
            placeholder="例: 山田 太郎"
            value={name}
            onChangeText={setName}
            error={nameError}
            autoFocus={false}
          />
          
          <Input
            label="部屋番号"
            placeholder="例: 101"
            value={roomNumber}
            onChangeText={setRoomNumber}
            error={roomNumberError}
            keyboardType="number-pad"
          />

          <Button
            title="予約する"
            onPress={handleSubmit}
            disabled={!todayMenu || loading}
            loading={reservationLoading}
            style={styles.submitButton}
            icon={<CalendarClock size={20} color={Colors.white} />}
          />
          
          <Text style={styles.noteText}>
            ※予約は当日の午前10時までにお願いします。
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ご予約について</Text>
          <Text style={styles.infoText}>
            • 予約は当日の午前10時までにお願いします。
          </Text>
          <Text style={styles.infoText}>
            • キャンセルは前日までにご連絡ください。
          </Text>
          <Text style={styles.infoText}>
            • お支払いは現金のみとなります。
          </Text>
          <Text style={styles.infoText}>
            • アレルギーなどがある場合は、予約時にお知らせください。
          </Text>
        </View>
        
        {/* 追加のスペースでスクロールを確保 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <LoadingOverlay visible={loading} />
    </KeyboardAvoidingView>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
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
  submitButton: {
    marginTop: 16,
    height: 50,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  successText: {
    color: Colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
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
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 80, // スクロール時の余白（キーボード対応）
  },
});