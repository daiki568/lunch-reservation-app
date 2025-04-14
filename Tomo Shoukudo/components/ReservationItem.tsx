import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { Reservation } from '@/types';
import { Check, X, Trash2 } from 'lucide-react-native';

interface ReservationItemProps {
  reservation: Reservation;
  onTogglePayment: (id: string, isPaid: boolean) => void;
  onDelete: (id: string) => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onTogglePayment,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{reservation.name}</Text>
        <Text style={styles.roomNumber}>部屋番号: {reservation.roomNumber}</Text>
        <Text style={styles.date}>{formatDate(reservation.date)}</Text>
        <View style={styles.paymentStatus}>
          <Text style={styles.paymentLabel}>支払い状況:</Text>
          <View
            style={[
              styles.paymentBadge,
              reservation.isPaid ? styles.paidBadge : styles.unpaidBadge,
            ]}
          >
            <Text
              style={[
                styles.paymentText,
                reservation.isPaid ? styles.paidText : styles.unpaidText,
              ]}
            >
              {reservation.isPaid ? '支払い済み' : '未払い'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            reservation.isPaid ? styles.unpayButton : styles.payButton,
          ]}
          onPress={() => onTogglePayment(reservation.id!, !reservation.isPaid)}
        >
          {reservation.isPaid ? (
            <X size={18} color={Colors.error} />
          ) : (
            <Check size={18} color={Colors.success} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(reservation.id!)}
        >
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  unpaidBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  paidText: {
    color: Colors.success,
  },
  unpaidText: {
    color: Colors.error,
  },
  actionsContainer: {
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  payButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  unpayButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
});

export default ReservationItem;