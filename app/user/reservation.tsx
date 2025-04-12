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
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzkNLkbLshdXh4-ZECIm76AzTGlnZGUm6e3r0G3HTR30fKbGt3qZYHKsFb5BkFKn_uu/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      }
    );

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
    } else if (!/^\d{1,4}$/.test(roomNumber.trim())) {
      newErrors.roomNumber = '有効な部屋番号を入力してください';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
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
        createdAt
