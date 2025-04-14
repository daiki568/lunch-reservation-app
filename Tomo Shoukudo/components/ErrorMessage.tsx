import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { AlertTriangle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <AlertTriangle color={Colors.error} size={20} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
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
});

export default ErrorMessage;