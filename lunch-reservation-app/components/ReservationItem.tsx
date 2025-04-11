import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reservation } from '@/types';
import Colors from '@/constants/colors';
import { Check, X } from 'lucide-react-native';

interface ReservationItemProps {
  reservation: Reservation;
  onTogglePayment: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReservationItem({
  reservation,
  onTogglePayment,
  onDelete,
}: ReservationItemProps) {
  const createdAtTime = new Date(reservation.createdAt).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{reservation.name}</Text>
        <Text style={styles.roomNumber}>部屋番号: {reservation.roomNumber}</Text>
        <Text style={styles.time}>予約時間: {createdAtTime}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            reservation.isPaid ? styles.paidButton : styles.unpaidButton,
          ]}
          onPress={() => onTogglePayment(reservation.id)}
        >
          <Text style={styles.statusText}>
            {reservation.isPaid ? '支払済' : '未払い'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(reservation.id)}
        >
          <X size={16} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  paidButton: {
    backgroundColor: Colors.success + '20', // 20% opacity
  },
  unpaidButton: {
    backgroundColor: Colors.pending + '20', // 20% opacity
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  deleteButton: {
    padding: 8,
  },
});