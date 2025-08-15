import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const getChipColor = (feedingType: string) => {
  const normalizedType = feedingType.toLowerCase(); // Normalize to lowercase
  switch (normalizedType) {
    case 'breastfeeding':
    case 'breast milk':
      return '#ADD8E6'; // Light Blue
    case 'mom\'s milk':
      return '#E0BBE4'; // Light Purple
    case 'donor milk':
      return '#00FFFF'; // Cyan
    case 'formula':
      return '#FFFFE0'; // Light Yellow
    case 'solid food':
      return '#90EE90'; // Light Green
    default:
      return '#e0e0e0'; // Default light grey
  }
};

export interface FeedingRecord {
  id: string;
  Day: number;
  'Start Time': string;
  'Feeding Type': string;
  'Feeding Amount (ml)'?: number;
  L?: boolean;
  R?: boolean;
  Urine?: boolean;
  'BM (Bowel Movement)'?: boolean;
  Notes?: string;
}

interface FeedingRecordsListProps {
  records: FeedingRecord[];
}

const renderRecordItem = ({ item }: { item: FeedingRecord }) => {
  console.log('Rendered item:', item);
  return (
    <View style={styles.recordRow}>
    <ThemedText style={styles.recordColStartTime}>{item['Start Time']}</ThemedText>
    <ThemedText style={styles.recordColCheck}>{item.L ? '✅' : ''}</ThemedText>
    <ThemedText style={styles.recordColCheck}>{item.R ? '✅' : ''}</ThemedText>
    <ThemedText style={styles.recordColCheck}>{item.Urine ? '✅' : ''}</ThemedText>
    <ThemedText style={styles.recordColCheck}>{item['BM (Bowel Movement)'] ? '✅' : ''}</ThemedText>
    {((Array.isArray(item['Feeding Type']) ? item['Feeding Type'].join(', ') : item['Feeding Type']) || '').split(',').map((type, index) => (
      <View key={index} style={[styles.chipContainer, { backgroundColor: getChipColor(type.trim()) }]}>
        <ThemedText style={styles.chipText}>
          {type.trim()}
        </ThemedText>
      </View>
    ))}
    {item['Feeding Amount (ml)'] && (
      <View style={[styles.chipContainer, styles.amountChipContainer]}>
        <ThemedText style={styles.chipText}>{item['Feeding Amount (ml)']}ml</ThemedText>
      </View>
    )}
    <ThemedText style={styles.recordColNotes}>{item.Notes}</ThemedText>
  </View>
  );
};

const DayHeader = ({ day }: { day: number }) => (
  <View>
    <ThemedText type="subtitle" style={styles.dayTitle}>Day {day}</ThemedText>
    <View style={styles.headerRow}>
      <ThemedText style={styles.headerColStartTime}>Start Time</ThemedText>
      <ThemedText style={styles.headerColCheck}>L</ThemedText>
      <ThemedText style={styles.headerColCheck}>R</ThemedText>
      <ThemedText style={styles.headerColCheck}>Urine</ThemedText>
      <ThemedText style={styles.headerColCheck}>BM</ThemedText>
      <ThemedText style={styles.headerColTypeAmount}>Type / Amount / Notes</ThemedText>
    </View>
  </View>
);

export default function FeedingRecordsList({ records }: FeedingRecordsListProps) {
  // Group records by day
  const groupedRecords = records.reduce((acc, record) => {
    const day = record.Day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(record);
    return acc;
  }, {} as Record<number, FeedingRecord[]>);

  // Sort days in descending order
  const sortedDays = Object.keys(groupedRecords).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <FlatList
      data={sortedDays}
      keyExtractor={(day) => day.toString()}
      renderItem={({ item: day }) => (
        <View>
          <DayHeader day={parseInt(day)} />
          <FlatList
            data={groupedRecords[parseInt(day)]}
            renderItem={renderRecordItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.dayListContainer}
          />
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 32,
  },
  dayListContainer: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  dayTitle: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
    backgroundColor: '#e0e0e0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  headerColStartTime: {
    width: 80,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerColCheck: {
    width: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerColTypeAmount: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerColNotes: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    alignItems: 'center',
  },
  recordColStartTime: {
    width: 80,
    textAlign: 'center',
  },
  recordColCheck: {
    width: 40,
    textAlign: 'center',
  },
  chipContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0', // Light grey background for the chip
    borderRadius: 15, // Rounded corners
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5, // Add some margin to separate from other columns
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountChipContainer: {
    backgroundColor: '#d3d3d3', // Light gray for amount chip
    marginLeft: 5, // Add some margin to separate from type chip
  },
  recordColAmount: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  recordColNotes: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 5,
  },
});