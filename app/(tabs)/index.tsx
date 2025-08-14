import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '@/constants/environment';
import FeedingRecordsList from '@/components/FeedingRecordsList';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Initialize Airtable
const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const base = airtable.base(AIRTABLE_BASE_ID);

export default function HomeScreen() {
  console.log('app/(tabs)/index.tsx');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const colorScheme = useColorScheme();

  const fetchData = () => {
    setLoading(true);
    let allRecords = [];
    base('Feeding Tracker').select({
      sort: [{ field: 'Day', direction: 'desc' }, { field: 'Start Time', direction: 'desc' }]
    }).eachPage((records, fetchNextPage) => {
      allRecords = [...allRecords, ...records.map(record => ({ id: record.id, ...record.fields }))];
      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
      } else {
        setRecords(allRecords.sort((a, b) => {
          if (a.Day === b.Day) {
            return new Date(`2000/01/01 ${a['Start Time']}`).getTime() - new Date(`2000/01/01 ${b['Start Time']}`).getTime();
          }
          return b.Day - a.Day;
        }));
      }
      setLoading(false);
      setLastUpdated(new Date());
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Auto-refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={[Colors[colorScheme ?? 'light'].background, '#FFFBF0']}
      style={styles.safeArea}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={{ fontFamily: 'SpaceMono' }}>Feeding Tracker</ThemedText>
          <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
            <MaterialIcons name="refresh" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          </TouchableOpacity>
        </ThemedView>
        <ThemedText style={styles.lastUpdatedText}>Last updated: {lastUpdated.toLocaleTimeString()} (Auto-refresh every minute)</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        ) : (
          <Card style={styles.listCard}>
            <FeedingRecordsList records={records} />
          </Card>
        )}
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lastUpdatedText: {
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SpaceMono',
  },
  refreshButton: {
    padding: 8,
  },
  listCard: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
});
