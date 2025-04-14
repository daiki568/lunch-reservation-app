import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import Colors from '@/constants/colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          props.editable === false && styles.disabledInput,
        ]}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  disabledInput: {
    backgroundColor: Colors.surface,
    color: Colors.textSecondary,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;