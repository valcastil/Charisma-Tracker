import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, CharismaEntry, UserProfile, UserStats } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileHeader } from '@/components/profile/profile-header';
import { StatsCard } from '@/components/profile/stats-card';
import { RecentEntries } from '@/components/profile/recent-entries';
import { QuickActions } from '@/components/profile/settings-button';
import { getProfile, updateProfile, calculateUserStats, getRecentEntries } from '@/utils/profile-utils';

const ENTRIES_KEY = '@charisma_entries';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<CharismaEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('Starting to load profile data...');
      
      let [profileData, entriesData] = await Promise.all([
        getProfile(),
        AsyncStorage.getItem(ENTRIES_KEY),
      ]);

      console.log('Profile data loaded:', profileData);
      console.log('Entries data loaded:', entriesData);

      const entries: CharismaEntry[] = entriesData ? JSON.parse(entriesData) : [];
      console.log('Parsed entries:', entries.length);
      
      // Calculate stats
      const userStats = await calculateUserStats(entries);
      const recent = getRecentEntries(entries, 5);
      
      console.log('User stats calculated:', userStats);
      console.log('Top charisma type:', userStats.topCharisma.type);
      console.log('Top charisma count:', userStats.topCharisma.count);
      console.log('Recent entries:', recent.length);
      
      // Update profile with current stats
      const updatedProfile = await updateProfile({
        totalEntries: userStats.totalEntries,
        streak: userStats.currentStreak,
        topCharisma: userStats.topCharisma.type || 'confidence',
      });

      console.log('Profile updated successfully with topCharisma:', updatedProfile.topCharisma);

      setProfile(updatedProfile);
      setStats(userStats);
      setRecentEntries(recent);
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', `Unable to load profile data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const handleEditProfile = () => {
    router.push('/edit-profile?tab=basic');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleExportData = async () => {
    // This is handled in the settings button component
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading profile...
          </Text>
        </View>
      </View>
    );
  }

  if (!profile || !stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Unable to load profile
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.gold }]}
            onPress={loadProfileData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <ProfileHeader
          profile={profile}
          onEditPress={handleEditProfile}
        />
        
        <StatsCard stats={stats} />
        
        <RecentEntries entries={recentEntries} />
        
        <QuickActions
          onEditProfile={handleEditProfile}
          onExportData={handleExportData}
          onSettings={handleSettings}
        />
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Charisma Tracker v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000000',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 50,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
