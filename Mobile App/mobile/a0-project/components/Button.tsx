import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ title, onPress, variant = 'primary' }: ButtonProps) => {
  const colors = useThemeColors();
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: variant === 'primary' ? colors.primary : colors.surface }
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.text, 
        { color: variant === 'primary' ? colors.white : colors.primary }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});