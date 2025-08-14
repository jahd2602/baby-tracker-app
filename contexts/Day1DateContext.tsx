
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_DAY_1_DATE = '2025-07-28'; // YYYY-MM-DD
const DAY_1_DATE_KEY = 'day1Date';

interface Day1DateContextType {
  day1Date: string;
  setDay1Date: (date: string) => void;
}

const Day1DateContext = createContext<Day1DateContextType | undefined>(undefined);

export const Day1DateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [day1Date, setDay1Date] = useState(DEFAULT_DAY_1_DATE);

  useEffect(() => {
    const loadDay1Date = async () => {
      try {
        const storedDate = await AsyncStorage.getItem(DAY_1_DATE_KEY);
        if (storedDate !== null) {
          setDay1Date(storedDate);
        } else {
          // Save default if nothing is stored
          await AsyncStorage.setItem(DAY_1_DATE_KEY, DEFAULT_DAY_1_DATE);
        }
      } catch (error) {
        console.error('Error loading Day 1 Date from AsyncStorage:', error);
      }
    };
    loadDay1Date();
  }, []);

  const updateDay1Date = async (newDate: string) => {
    try {
      await AsyncStorage.setItem(DAY_1_DATE_KEY, newDate);
      setDay1Date(newDate);
    } catch (error) {
      console.error('Error saving Day 1 Date to AsyncStorage:', error);
    }
  };

  return (
    <Day1DateContext.Provider value={{ day1Date, setDay1Date: updateDay1Date }}>
      {children}
    </Day1DateContext.Provider>
  );
};

export const useDay1Date = () => {
  const context = useContext(Day1DateContext);
  if (context === undefined) {
    throw new Error('useDay1Date must be used within a Day1DateProvider');
  }
  return context;
};
