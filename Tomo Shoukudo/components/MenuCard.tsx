import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '@/constants/colors';
import { Menu } from '@/types';
import { Utensils } from 'lucide-react-native';

interface MenuCardProps {
  menu: Menu;
  showDate?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, showDate = false }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString() + '円';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <View style={styles.card}>
      {menu.imageUrl ? (
        <Image source={{ uri: menu.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Utensils size={40} color={Colors.primaryLight} />
        </View>
      )}
      <View style={styles.content}>
        {showDate && (
          <Text style={styles.date}>{formatDate(menu.date)}</Text>
        )}
        <Text style={styles.title}>{menu.name}</Text>
        <Text style={styles.description}>{menu.description}</Text>
        <Text style={styles.price}>{formatPrice(menu.price)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default MenuCard;