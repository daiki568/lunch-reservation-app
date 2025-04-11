import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DatePickerProps {
  selectedDate: string; // ISO形式の日付 (YYYY-MM-DD)
  onDateChange: (date: string) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const selectedDateObj = new Date(selectedDate);
  
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDateObj);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay.toISOString().split('T')[0]);
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay.toISOString().split('T')[0]);
  };
  
  const formattedDate = selectedDateObj.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  
  const isToday = new Date().toISOString().split('T')[0] === selectedDate;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
        <ChevronLeft size={24} color={Colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {isToday && <Text style={styles.todayBadge}>今日</Text>}
      </View>
      
      <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
        <ChevronRight size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  arrowButton: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  todayBadge: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.primary + '20', // 20% opacity
    borderRadius: 12,
  },
});