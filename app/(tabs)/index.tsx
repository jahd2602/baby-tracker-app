import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '@/constants/environment';
import FeedingRecordsList from '@/components/FeedingRecordsList';

// Initialize Airtable
const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const base = airtable.base(AIRTABLE_BASE_ID);

export default function HomeScreen() {
  console.log('app/(tabs)/index.tsx');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = () => {
    setLoading(true);
    base('Feeding Tracker').select({
      sort: [{ field: 'Day', direction: 'desc' }, { field: 'Start Time', direction: 'desc' }]
    }).eachPage((records, fetchNextPage) => {
      setRecords(records.map(record => ({ id: record.id, ...record.fields })).sort((a, b) => {
        if (a.Day === b.Day) {
          return new Date(`2000/01/01 ${a['Start Time']}`).getTime() - new Date(`2000/01/01 ${b['Start Time']}`).getTime();
        }
        return b.Day - a.Day;
      }));
      setLoading(false);
      setLastUpdated(new Date());
      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        setLoading(false);
      }
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
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title">Feeding Tracker</ThemedText>
          <Button title="Refresh" onPress={fetchData} />
        </ThemedView>
        <ThemedText style={styles.lastUpdatedText}>Last updated: {lastUpdated.toLocaleTimeString()} (Auto-refresh every minute)</ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FeedingRecordsList records={records} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lastUpdatedText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
