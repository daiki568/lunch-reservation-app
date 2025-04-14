import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useMenuStore } from '@/store/menu-store';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import MenuCard from '@/components/MenuCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorMessage from '@/components/ErrorMessage';
import { formatDateJP } from '@/utils/date-utils';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react-native';

export default function MenuManagementScreen() {
  const { allMenus, loading, error, fetchAllMenus, addMenu, updateMenu, deleteMenu } = useMenuStore();
  
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [dateError, setDateError] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const resetForm = () => {
    setDate('');
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setEditingId(null);
    setDateError('');
    setNameError('');
    setPriceError('');
  };

  const validateForm = () => {
    let isValid = true;

    if (!date.trim()) {
      setDateError('日付を入力してください');
      isValid = false;
    } else {
      setDateError('');
    }

    if (!name.trim()) {
      setNameError('メニュー名を入力してください');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!price.trim()) {
      setPriceError('価格を入力してください');
      isValid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError('有効な価格を入力してください');
      isValid = false;
    } else {
      setPriceError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const menuData = {
      date,
      name,
      description: description || '',
      price: Number(price),
      imageUrl: imageUrl || undefined,
    };

    let success;
    if (editingId) {
      success = await updateMenu(editingId, menuData);
      if (success) {
        Alert.alert('更新完了', 'メニューが更新されました');
        resetForm();
      }
    } else {
      success = await addMenu(menuData);
      if (success) {
        Alert.alert('登録完了', 'メニューが登録されました');
        resetForm();
      }
    }
  };

  const handleEdit = (menu: any) => {
    setEditingId(menu.id);
    setDate(menu.date);
    setName(menu.name);
    setDescription(menu.description || '');
    setPrice(String(menu.price));
    setImageUrl(menu.imageUrl || '');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      '削除確認',
      'このメニューを削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          onPress: async () => {
            const success = await deleteMenu(id);
            if (success) {
              Alert.alert('削除完了', 'メニューが削除されました');
              if (editingId === id) {
                resetForm();
              }
            }
          },
          style: 'destructive',
        },
      ]
    );
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
        <ErrorMessage message={error} />

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'メニュー編集' : '新規メニュー登録'}
          </Text>
          
          <Input
            label="日付"
            placeholder="YYYY-MM-DD (例: 2023-06-15)"
            value={date}
            onChangeText={setDate}
            error={dateError}
          />
          
          <Input
            label="メニュー名"
            placeholder="例: ハンバーグ定食"
            value={name}
            onChangeText={setName}
            error={nameError}
          />
          
          <Input
            label="説明"
            placeholder="例: 特製デミグラスソースのハンバーグ"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
          
          <Input
            label="価格 (円)"
            placeholder="例: 800"
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
            error={priceError}
          />
          
          <Input
            label="画像URL (オプション)"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          <View style={styles.buttonContainer}>
            <Button
              title={editingId ? '更新する' : '登録する'}
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
            
            {editingId && (
              <Button
                title="キャンセル"
                onPress={resetForm}
                variant="outline"
                style={styles.cancelButton}
              />
            )}
          </View>
        </View>

        <View style={styles.menuListContainer}>
          <Text style={styles.sectionTitle}>登録済みメニュー</Text>
          
          {allMenus.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Calendar size={40} color={Colors.primaryLight} />
              <Text style={styles.emptyText}>
                登録されたメニューはありません
              </Text>
            </View>
          ) : (
            allMenus.map((menu) => (
              <View key={menu.id} style={styles.menuItemContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuDate}>{formatDateJP(menu.date)}</Text>
                  <View style={styles.menuActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEdit(menu)}
                    >
                      <Edit2 size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDelete(menu.id!)}
                    >
                      <Trash2 size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                <MenuCard menu={menu} />
              </View>
            ))
          )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 12,
  },
  menuListContainer: {
    marginBottom: 24,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  menuItemContainer: {
    marginBottom: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuDate: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  menuActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 80, // スクロール時の余白（キーボード対応）
  },
});