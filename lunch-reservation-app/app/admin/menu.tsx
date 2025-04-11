import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import { useMenuStore } from '@/store/menu-store';
import Colors from '@/constants/colors';

export default function AdminMenuScreen() {
  const router = useRouter();
  const { getDailyMenu, setDailyMenu } = useMenuStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '', price: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const menu = getDailyMenu(selectedDate);
    if (menu) {
      setMenuName(menu.name);
      setMenuDescription(menu.description);
      setMenuPrice(menu.price.toString());
    } else {
      setMenuName('');
      setMenuDescription('');
      setMenuPrice('');
    }
  }, [selectedDate]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', description: '', price: '' };
    
    if (!menuName.trim()) {
      newErrors.name = 'メニュー名を入力してください';
      isValid = false;
    }
    
    if (!menuDescription.trim()) {
      newErrors.description = '説明を入力してください';
      isValid = false;
    }
    
    if (!menuPrice.trim()) {
      newErrors.price = '価格を入力してください';
      isValid = false;
    } else if (isNaN(Number(menuPrice)) || Number(menuPrice) <= 0) {
      newErrors.price = '有効な価格を入力してください';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSaveMenu = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      setDailyMenu(
        selectedDate,
        menuName,
        menuDescription,
        Number(menuPrice)
      );
      
      Alert.alert(
        '保存完了',
        `${new Date(selectedDate).toLocaleDateString('ja-JP')}のメニューを保存しました`,
        [{ text: 'OK' }]
      );
      
      setIsSubmitting(false);
    } catch (error) {
      Alert.alert(
        'エラー',
        'メニューの保存中にエラーが発生しました。もう一度お試しください。'
      );
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header title="メニュー管理" showBackButton />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>日付選択</Text>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>メニュー情報</Text>
          
          <Input
            label="メニュー名"
            value={menuName}
            onChangeText={setMenuName}
            placeholder="例: 唐揚げ定食"
            error={errors.name}
            style={styles.input}
          />
          
          <Input
            label="説明"
            value={menuDescription}
            onChangeText={setMenuDescription}
            placeholder="例: 国産鶏肉を使用した唐揚げと季節の野菜を使ったサラダ付き"
            error={errors.description}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          
          <Input
            label="価格 (円)"
            value={menuPrice}
            onChangeText={setMenuPrice}
            placeholder="例: 800"
            keyboardType="number-pad"
            error={errors.price}
            style={styles.input}
          />
          
          <Button
            title="メニューを保存"
            onPress={handleSaveMenu}
            loading={isSubmitting}
            style={styles.saveButton}
          />
          
          <Button
            title="管理画面に戻る"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
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
  saveButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 12,
  },
});