import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyMenu } from '@/types';
import Card from './Card';
import Colors from '@/constants/colors';
import { Utensils } from 'lucide-react-native';

interface MenuDisplayProps {
  menu: DailyMenu | null;
  date: string;
}

export default function MenuDisplay({ menu, date }: MenuDisplayProps) {
  const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (!menu) {
    return (
      <Card>
        <View style={styles.noMenuContainer}>
          <Utensils size={32} color={Colors.textLight} />
          <Text style={styles.noMenuText}>
            {formattedDate}のメニューはまだ設定されていません
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={styles.date}>{formattedDate}</Text>
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuName}>{menu.name}</Text>
          <Text style={styles.menuPrice}>¥{menu.price.toLocaleString()}</Text>
        </View>
        <Text style={styles.menuDescription}>{menu.description}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  menuContainer: {
    marginTop: 4,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  menuDescription: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  noMenuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noMenuText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});