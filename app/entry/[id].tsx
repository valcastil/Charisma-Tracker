import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, CharismaEntry } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ENTRIES_KEY = '@charisma_entries';

export default function EntryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const [entry, setEntry] = useState<CharismaEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
      if (entriesData) {
        const entries: CharismaEntry[] = JSON.parse(entriesData);
        const foundEntry = entries.find((e) => e.id === id);
        setEntry(foundEntry || null);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
              if (entriesData) {
                const entries: CharismaEntry[] = JSON.parse(entriesData);
                const updatedEntries = entries.filter((e) => e.id !== id);
                await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));
                router.back();
              }
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Entry not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Date */}
        <Text style={[styles.date, { color: colors.textSecondary }]}>{entry.date}</Text>

        {/* Major Charisma */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Major Charisma
          </Text>
          <Text style={[styles.sectionValue, { color: colors.text }]}>{entry.majorCharisma}</Text>
        </View>

        {/* Emotions */}
        {entry.emotionEmojis && entry.emotionEmojis.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Emotions
            </Text>
            <View style={styles.emotionsContainer}>
              {entry.emotionEmojis.map((emoji, index) => (
                <Text key={index} style={styles.emotionEmoji}>{emoji}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Sub Charisma */}
        {entry.subCharisma && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Sub-Charisma
            </Text>
            <Text style={[styles.sectionValue, { color: colors.text }]}>{entry.subCharisma}</Text>
          </View>
        )}

        {/* Notes */}
        {entry.notes && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Notes</Text>
            <Text style={[styles.notesValue, { color: colors.text }]}>{entry.notes}</Text>
          </View>
        )}

        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: '#FF3B30' }]}
          onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  date: {
    fontSize: 14,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emotionEmoji: {
    fontSize: 32,
  },
  notesValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: 24,
    marginBottom: 40,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
