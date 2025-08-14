import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export const Card = ({ children, style }) => {
  const cardBackgroundColor = useThemeColor({}, 'card');

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBackgroundColor }, style]}>
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 20,
  },
});