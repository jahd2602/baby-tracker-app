
import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_DAY_1_DATE = '2025-07-28'; // YYYY-MM-DD
const DAY_1_DATE_KEY = 'day1Date';

export default function SettingsScreen() {
  const [day1Date, setDay1Date] = useState(DEFAULT_DAY_1_DATE);

  useEffect(() => {
    const loadDay1Date = async () => {
      try {
        const storedDate = await AsyncStorage.getItem(DAY_1_DATE_KEY);
        if (storedDate !== null) {
          setDay1Date(storedDate);
        }
      } catch (error) {
        console.error('Error loading Day 1 Date:', error);
      }
    };
    loadDay1Date();
  }, []);

  const saveDay1Date = async () => {
    try {
      await AsyncStorage.setItem(DAY_1_DATE_KEY, day1Date);
      alert('Day 1 Date saved!');
    } catch (error) {
      console.error('Error saving Day 1 Date:', error);
      alert('Error saving Day 1 Date.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <ThemedView style={styles.settingItem}>
        <ThemedText>Date of Day 1 (YYYY-MM-DD):</ThemedText>
        <TextInput
          style={styles.input}
          value={day1Date}
          onChangeText={setDay1Date}
          placeholder="YYYY-MM-DD"
        />
        <Button title="Save" onPress={saveDay1Date} />
      </ThemedView>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginLeft: 10,
    flex: 1,
  },
  
});
