
// This component displays the last feeding time and how long ago it was.
// It fetches the data from Airtable and calculates the time difference.

import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '@/constants/environment';
import { useDay1Date } from '../../contexts/Day1DateContext';
import { Card } from '@/components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Initialize Airtable
const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });

// Ensure AIRTABLE_BASE_ID is defined
if (!AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not defined in environment variables.');
}
const base = airtable.base(AIRTABLE_BASE_ID);

export default function HomeScreen() {
  const { day1Date: day1DateString } = useDay1Date();
  const [lastFeeding, setLastFeeding] = useState<{ time: string; timeAgo: string; dayNumber: number } | null>(null);
  const [futureTimes, setFutureTimes] = useState<{ threeHours: string; fourHours: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLastFeeding = useCallback(() => {
    setLoading(true);
    base('Feeding Tracker').select({
      maxRecords: 5, // Fetch only the last 5 records
      sort: [{ field: 'Day', direction: 'desc' }, { field: 'Start Time', direction: 'desc' }]
    }).firstPage((err, records) => {
      if (err) {
        console.error(err);
        setLoading(false);
        return;
      }

      if (!records) {
        setLoading(false);
        return;
      }

      console.log('Received records:', records);

      const feedingRecords = records.filter(record => record.get('Feeding Type'));
      console.log('Filtered feeding records:', feedingRecords);

      if (feedingRecords.length > 0) {
        const lastRecord = feedingRecords[0];
        console.log('Last record:', lastRecord);

        const startTime = lastRecord.get('Start Time');
        const day = lastRecord.get('Day') as number;

        if (typeof startTime === 'string' && day) {
          const now = new Date();
          const [hours, minutes] = startTime.split(':').map(Number);

          // Calculate entryDate based on DATE_OF_DAY_1 and the 'Day' field
          const DATE_OF_DAY_1 = new Date(day1DateString + 'T00:00:00');
          const entryDate = new Date(DATE_OF_DAY_1);
          entryDate.setDate(DATE_OF_DAY_1.getDate() + day - 1);
          entryDate.setHours(hours, minutes, 0, 0);

          const diff = now.getTime() - entryDate.getTime();
          const hoursAgo = Math.floor(diff / (1000 * 60 * 60));
          const minutesAgo = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

          console.log('Current time:', now);
          console.log('Entry date:', entryDate);
          console.log('Difference (ms):', diff);
          console.log('Hours ago:', hoursAgo);
          console.log('Minutes ago:', minutesAgo);

          setLastFeeding({
            time: startTime,
            timeAgo: `${hoursAgo}h ${minutesAgo}m ago`,
            dayNumber: day,
          });

          const threeHoursLater = new Date(entryDate.getTime() + 3 * 60 * 60 * 1000);
          const fourHoursLater = new Date(entryDate.getTime() + 4 * 60 * 60 * 1000);

          const formatTime = (date: Date) => {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          };

          setFutureTimes({
            threeHours: formatTime(threeHoursLater),
            fourHours: formatTime(fourHoursLater),
          });
        }
      }
      setLoading(false);
    });
  }, [day1DateString]); // Re-run effect when day1DateString changes

  useEffect(() => {
    fetchLastFeeding();
  }, [fetchLastFeeding]);

  const colorScheme = useColorScheme();

  return (
    <LinearGradient
      colors={[Colors[colorScheme ?? 'light'].background, '#FFFBF0']}
      style={{flex: 1}}
    >
      <ThemedView style={styles.container}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLastFeeding}>
          <MaterialIcons name="refresh" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
        <ThemedText type="title">Last Feeding</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        ) : lastFeeding ? (
          <Card>
            <View style={styles.feedingInfo}>
              <ThemedText style={styles.time}>{lastFeeding.timeAgo}</ThemedText>
              <View style={styles.row}>
                <ThemedText style={styles.dayNumber}>(Day {lastFeeding.dayNumber})</ThemedText>
                <ThemedText style={styles.timeAgo}>{lastFeeding.time}</ThemedText>
              </View>
            </View>
            {futureTimes && (
              <View style={styles.futureTimesContainer}>
                <View style={styles.row}>
                  <ThemedText>in 3h time: </ThemedText>
                  <ThemedText style={styles.futureTimeText}>{futureTimes.threeHours}</ThemedText>
                </View>
                <View style={styles.row}>
                  <ThemedText>in 4h time: </ThemedText>
                  <ThemedText style={styles.futureTimeText}>{futureTimes.fourHours}</ThemedText>
                </View>
              </View>
            )}
          </Card>
        ) : (
          <ThemedText>No feeding data found.</ThemedText>
        )}
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  feedingInfo: {
    alignItems: 'center',
  },
  time: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    lineHeight: 48,
  },
  timeAgo: {
    fontSize: 18,
    marginHorizontal: 5,
    fontFamily: 'SpaceMono',
  },
  dayNumber: {
    fontSize: 18,
    marginHorizontal: 5,
    fontFamily: 'SpaceMono',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  futureTimesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  futureTimeText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});
