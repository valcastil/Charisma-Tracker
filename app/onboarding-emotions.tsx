import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CharismaLogo } from '@/components/charisma-logo';

const ONBOARDING_KEY = '@charisma_onboarding';

interface EmotionOption {
  emoji: string;
  label: string;
  id: string;
}

interface EmotionCategory {
  title: string;
  options: EmotionOption[];
}

const emotionCategories: EmotionCategory[] = [
  {
    title: 'Confidence & Power',
    options: [
      { emoji: '💪', label: 'Flexed\nBiceps', id: 'flexed_biceps' },
      { emoji: '👑', label: 'Crown', id: 'crown' },
      { emoji: '🦁', label: 'Lion', id: 'lion' },
      { emoji: '🏆', label: 'Trophy', id: 'trophy' },
      { emoji: '⚡', label: 'High\nVoltage', id: 'high_voltage' },
      { emoji: '😎', label: 'Sunglasses', id: 'sunglasses' },
      { emoji: '🕴️', label: 'Man in\nSuit', id: 'man_suit' },
      { emoji: '🧠', label: 'Brain', id: 'brain' },
    ],
  },
  {
    title: 'Warmth & Kindness',
    options: [
      { emoji: '🤗', label: 'Hugging\nFace', id: 'hugging_face_warmth' },
      { emoji: '☀️', label: 'Sun', id: 'sun' },
      { emoji: '🌻', label: 'Sunflower', id: 'sunflower' },
      { emoji: '💖', label: 'Sparkling\nHeart', id: 'sparkling_heart' },
      { emoji: '🌈', label: 'Rainbow', id: 'rainbow' },
      { emoji: '🤝', label: 'Handshake', id: 'handshake_warmth' },
      { emoji: '🕊️', label: 'Dove', id: 'dove' },
      { emoji: '👐', label: 'Open\nHands', id: 'open_hands' },
    ],
  },
  {
    title: 'Inspiration & Motivation',
    options: [
      { emoji: '🚀', label: 'Rocket', id: 'rocket' },
      { emoji: '🌟', label: 'Glowing\nStar', id: 'glowing_star' },
      { emoji: '🔥', label: 'Fire', id: 'fire' },
      { emoji: '✨', label: 'Sparkles', id: 'sparkles' },
      { emoji: '🌞', label: 'Sun with\nFace', id: 'sun_face' },
      { emoji: '🎉', label: 'Party\nPopper', id: 'party_popper' },
      { emoji: '🗣️', label: 'Speaking\nHead', id: 'speaking_head' },
      { emoji: '🎯', label: 'Direct Hit', id: 'direct_hit' },
    ],
  },
  {
    title: 'Focus & Presence',
    options: [
      { emoji: '👀', label: 'Eyes', id: 'eyes' },
      { emoji: '👂', label: 'Ear', id: 'ear' },
      { emoji: '🧘', label: 'Lotus\nPosition', id: 'lotus_position' },
      { emoji: '🧠', label: 'Brain', id: 'brain_2' },
      { emoji: '🗨️', label: 'Speech\nBubble', id: 'speech_bubble' },
      { emoji: '🙌', label: 'Raising\nHands', id: 'raising_hands' },
      { emoji: '🤔', label: 'Thinking\nFace', id: 'thinking_face' },
      { emoji: '💬', label: 'Speech\nBalloon', id: 'speech_balloon' },
    ],
  },
  {
    title: 'Humor & Playfulness',
    options: [
      { emoji: '😂', label: 'Tears of\nJoy', id: 'tears_joy' },
      { emoji: '😜', label: 'Winking\nTongue', id: 'winking_tongue' },
      { emoji: '🤡', label: 'Clown\nFace', id: 'clown_face' },
      { emoji: '🤣', label: 'Rolling\nLaughing', id: 'rolling_laughing' },
      { emoji: '😆', label: 'Grinning\nSquinting', id: 'grinning_squinting' },
      { emoji: '🎭', label: 'Performing\nArts', id: 'performing_arts' },
      { emoji: '😏', label: 'Smirking\nFace', id: 'smirking_face' },
      { emoji: '🙃', label: 'Upside-Down\nFace', id: 'upside_down' },
    ],
  },
  {
    title: 'Humility & Relatability',
    options: [
      { emoji: '🙏', label: 'Folded\nHands', id: 'folded_hands' },
      { emoji: '🧑‍🤝‍🧑', label: 'People\nHolding Hands', id: 'people_holding' },
      { emoji: '🤝', label: 'Handshake', id: 'handshake_2' },
      { emoji: '🥺', label: 'Pleading\nFace', id: 'pleading_face' },
      { emoji: '🤲', label: 'Palms Up', id: 'palms_up' },
      { emoji: '😊', label: 'Smiling\nFace', id: 'smiling_face' },
      { emoji: '🤗', label: 'Hugging\nFace', id: 'hugging_face_2' },
      { emoji: '🤫', label: 'Shushing\nFace', id: 'shushing_face' },
    ],
  },
  {
    title: 'Courage & Boldness',
    options: [
      { emoji: '🦅', label: 'Eagle', id: 'eagle' },
      { emoji: '🦸', label: 'Superhero', id: 'superhero' },
      { emoji: '🛡️', label: 'Shield', id: 'shield' },
      { emoji: '🗡️', label: 'Dagger', id: 'dagger' },
      { emoji: '🦾', label: 'Mechanical\nArm', id: 'mechanical_arm' },
      { emoji: '🎯', label: 'Target', id: 'target' },
      { emoji: '🔥', label: 'Fire', id: 'fire_2' },
      { emoji: '💥', label: 'Collision', id: 'collision' },
    ],
  },
];

export default function OnboardingEmotionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);

  const toggleEmotion = (emotionId: string) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId));
    } else {
      setSelectedEmotions([...selectedEmotions, emotionId]);
    }
  };

  const handleContinue = async () => {
    // Validate that at least one emotion is selected
    if (selectedEmotions.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one emotion to continue.');
      return;
    }

    // Store selected emotions and go to add-entry
    try {
      await AsyncStorage.setItem('@temp_selected_emotions', JSON.stringify(selectedEmotions));
      
      // Check if this is initial onboarding
      const onboardingData = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!onboardingData) {
        // Mark onboarding as complete for first-time users
        await AsyncStorage.setItem(
          ONBOARDING_KEY,
          JSON.stringify({ completed: true })
        );
      }
      
      router.push('/add-entry');
    } catch (error) {
      console.error('Error saving emotions:', error);
      Alert.alert('Error', 'Failed to save emotions. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Header with Logo and Title */}
      <View style={styles.header}>
        <CharismaLogo size={60} />
        <Text style={styles.appTitle}>Charisma Tracker</Text>
      </View>

      {/* Question and Subtitle */}
      <View style={styles.questionSection}>
        <Text style={styles.question}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Choose all that apply</Text>
      </View>

      {/* Emotions by Category */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {emotionCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.grid}>
              {category.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.emotionCard,
                    selectedEmotions.includes(option.id) && styles.emotionCardSelected,
                  ]}
                  onPress={() => toggleEmotion(option.id)}
                  activeOpacity={0.7}>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <Text style={styles.emotionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  questionSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 48,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F4C542',
    marginBottom: 16,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  emotionCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 6,
    marginBottom: 12,
  },
  emotionCardSelected: {
    backgroundColor: '#2A2A2A',
    borderColor: '#F4C542',
  },
  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomSection: {
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#F4C542',
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#F4C542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});
