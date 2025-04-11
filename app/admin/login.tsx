import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { Lock } from 'lucide-react-native';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLogin = () => {
    if (!pin.trim()) {
      setError('PINを入力してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = login(pin);
      
      if (success) {
        router.replace('/admin/dashboard');
      } else {
        setError('PINが正しくありません');
        setIsSubmitting(false);
      }
    } catch (error) {
      Alert.alert(
        'エラー',
        'ログイン処理中にエラーが発生しました。もう一度お試しください。'
      );
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Header title="管理者ログイン" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={48} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>管理者ログイン</Text>
        <Text style={styles.subtitle}>
          管理者PINを入力してください
        </Text>
        
        <View style={styles.formContainer}>
          <Input
            label="管理者PIN"
            value={pin}
            onChangeText={(text) => {
              setPin(text);
              setError('');
            }}
            placeholder="4桁のPINを入力"
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            error={error}
          />
          
          <Button
            title="ログイン"
            onPress={handleLogin}
            loading={isSubmitting}
            style={styles.loginButton}
          />
          
        </View>
      </View>
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
  },
  loginButton: {
    marginTop: 16,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
