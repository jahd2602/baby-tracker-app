import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface FeedingRecord {
  id: string;
  Day: number;
  'Start Time': string;
  'Feeding Type': string;
  'Feeding Amount (ml)'?: number;
  L?: boolean;
  R?: boolean;
  Urine?: boolean;
  BM?: boolean;
  Notes?: string;
}

interface FeedingRecordsListProps {
  records: FeedingRecord[];
}

const renderItem = ({ item }: { item: FeedingRecord }) => (
  <ThemedView style={styles.itemContainer}>
    <ThemedText type="defaultSemiBold">Day {item.Day} - {item['Start Time']}</ThemedText>
    <ThemedText>Feeding Type: {item['Feeding Type']}</ThemedText>
    {item['Feeding Amount (ml)'] && <ThemedText>Amount: {item['Feeding Amount (ml)']}ml</ThemedText>}
    <View style={styles.checksContainer}>
      <ThemedText>L: {item.L ? '✅' : '❌'}</ThemedText>
      <ThemedText>R: {item.R ? '✅' : '❌'}</ThemedText>
      <ThemedText>Urine: {item.Urine ? '✅' : '❌'}</ThemedText>
      <ThemedText>BM: {item.BM ? '✅' : '❌'}</ThemedText>
    </View>
    {item.Notes && <ThemedText>Notes: {item.Notes}</ThemedText>}
  </ThemedView>
);

export default function FeedingRecordsList({ records }: FeedingRecordsListProps) {
  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 32,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  checksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});
