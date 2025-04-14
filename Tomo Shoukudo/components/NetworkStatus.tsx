import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Platform } from 'react-native';

interface NetworkStatusProps {
  onRetry?: () => void;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry }) => {
  const [isConnected, setIsConnected] = useState(true);

  // 実際のアプリではNetInfoを使用してネットワーク状態を監視します
  // ここではデモのためにランダムな状態を生成します
  useEffect(() => {
    // デモ用：80%の確率で接続状態とする
    const connected = Math.random() > 0.2;
    setIsConnected(connected);
    
    // 実際のアプリでは以下のようにNetInfoを使用します
    // import NetInfo from '@react-native-community/netinfo';
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   setIsConnected(state.isConnected);
    // });
    // return () => unsubscribe();
  }, []);

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <WifiOff size={20} color={Colors.error} />
      <Text style={styles.text}>ネットワーク接続がありません</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={16} color={Colors.white} />
          <Text style={styles.retryText}>再試行</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  text: {
    color: Colors.error,
    marginLeft: 8,
    flex: 1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  retryText: {
    color: Colors.white,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NetworkStatus;