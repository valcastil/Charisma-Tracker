import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, CharismaEntry } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CharismaLogo } from '@/components/charisma-logo';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { updateProfile, calculateUserStats } from '@/utils/profile-utils';

const ENTRIES_KEY = '@charisma_entries';
const ONBOARDING_KEY = '@charisma_onboarding';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [entries, setEntries] = useState<CharismaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Handle onboarding navigation in useEffect instead of during render
  useEffect(() => {
    if (!loading && !onboardingComplete) {
      router.replace('/modal');
    }
  }, [loading, onboardingComplete]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [entriesData, onboardingData] = await Promise.all([
        AsyncStorage.getItem(ENTRIES_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);

      let parsedEntries: CharismaEntry[] = [];
      if (entriesData) {
        parsedEntries = JSON.parse(entriesData);
        setEntries(parsedEntries);
      }
      if (onboardingData) {
        const onboarding = JSON.parse(onboardingData);
        setOnboardingComplete(onboarding.completed);
      }

      // Update profile with latest stats
      if (parsedEntries.length > 0) {
        try {
          const userStats = await calculateUserStats(parsedEntries);
          await updateProfile({
            totalEntries: userStats.totalEntries,
            streak: userStats.currentStreak,
            topCharisma: userStats.topCharisma.type,
          });
        } catch (profileError) {
          console.error('Error updating profile stats:', profileError);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareEntry = async (entry: CharismaEntry, event: any) => {
    event.stopPropagation();
    try {
      const emotions = entry.emotionEmojis?.join(' ') || '';
      const message = `
🌟 Charisma Entry - ${entry.date}

${entry.charismaEmoji || ''} ${entry.majorCharisma}
${entry.subCharisma ? `Sub: ${entry.subCharisma}` : ''}

${emotions ? `Emotions: ${emotions}` : ''}

${entry.notes ? `Notes: ${entry.notes}` : ''}
      `.trim();

      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error sharing entry:', error);
      Alert.alert('Error', 'Failed to share entry');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  // Don't render anything if onboarding is not complete (navigation handled in useEffect)
  if (!onboardingComplete) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <CharismaLogo size={50} />
          <Text style={[styles.title, { color: colors.text }]}>Charisma Tracker</Text>
        </View>
        {/* Temporary Reset Button for Testing */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={async () => {
            await AsyncStorage.removeItem(ONBOARDING_KEY);
            router.replace('/modal');
          }}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Entries List */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No charisma entries yet.
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap the + button to add your first entry!
            </Text>
          </View>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={[styles.entryCard, { backgroundColor: colors.card }]}
              onPress={() => router.push(`/entry/${entry.id}`)}>
              {/* Header with Date and Time */}
              <View style={styles.entryHeader}>
                <Text style={[styles.entryDate, { color: colors.textSecondary }]}>
                  {entry.date}
                </Text>
                {entry.time && (
                  <Text style={[styles.entryTime, { color: colors.textSecondary }]}>
                    {entry.time}
                  </Text>
                )}
              </View>

              {/* Charisma Section with Large Emoji */}
              <View style={styles.charismaSection}>
                {entry.charismaEmoji && (
                  <Text style={styles.charismaEmoji}>{entry.charismaEmoji}</Text>
                )}
                <View style={styles.charismaTextContainer}>
                  <Text style={[styles.entryTitle, { color: colors.text }]}>
                    {entry.majorCharisma}
                  </Text>
                  {entry.subCharisma && (
                    <Text style={[styles.entrySubtitle, { color: colors.textSecondary }]}>
                      {entry.subCharisma}
                    </Text>
                  )}
                </View>
              </View>

              {/* Emotion Emojis */}
              {entry.emotionEmojis && entry.emotionEmojis.length > 0 && (
                <View style={styles.emotionsContainer}>
                  {entry.emotionEmojis.map((emoji, index) => (
                    <Text key={index} style={styles.emotionEmoji}>
                      {emoji}
                    </Text>
                  ))}
                </View>
              )}

              {/* Notes */}
              {entry.notes && (
                <Text
                  style={[styles.entryNotes, { color: colors.textSecondary }]}
                  numberOfLines={2}>
                  {entry.notes}
                </Text>
              )}

              {/* Share Button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={(e) => handleShareEntry(entry, e)}
                activeOpacity={0.7}>
                <IconSymbol size={20} name="paperplane.fill" color={colors.gold} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  entryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 12,
  },
  entryTime: {
    fontSize: 12,
  },
  charismaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  charismaEmoji: {
    fontSize: 48,
  },
  charismaTextContainer: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  entrySubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emotionEmoji: {
    fontSize: 24,
  },
  entryNotes: {
    fontSize: 14,
    lineHeight: 20,
  },
  shareButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
