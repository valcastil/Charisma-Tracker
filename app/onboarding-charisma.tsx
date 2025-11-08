import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CharismaLogo } from '@/components/charisma-logo';

const ONBOARDING_KEY = '@charisma_onboarding';

interface CharismaOption {
  emoji: string;
  label: string;
  id: string;
}

interface CharismaCategory {
  title: string;
  options: CharismaOption[];
}

const charismaCategories: CharismaCategory[] = [
  {
    title: 'Authority Charisma',
    options: [
      { emoji: '👑', label: 'Commanding\nPresence', id: 'commanding' },
      { emoji: '💪', label: 'Confidence', id: 'confidence' },
      { emoji: '📚', label: 'Expertise', id: 'expertise' },
      { emoji: '🕴️', label: 'Decisiveness', id: 'decisiveness' },
      { emoji: '🧑‍💼', label: 'Leadership\nAura', id: 'leadership' },
      { emoji: '🏆', label: 'Recognized\nCompetence', id: 'competence' },
      { emoji: '🗣️', label: 'Influence\nThrough Power', id: 'influence' },
      { emoji: '🙇‍♂️', label: 'Respect from\nOthers', id: 'respect' },
    ],
  },
  {
    title: 'Visionary Charisma',
    options: [
      { emoji: '🌟', label: 'Bold Ideas', id: 'bold_ideas' },
      { emoji: '🔮', label: 'Inspiring\nVision', id: 'inspiring_vision' },
      { emoji: '🎨', label: 'Creativity', id: 'creativity' },
      { emoji: '❤️', label: 'Passionate\nAbout Future', id: 'passionate_future' },
      { emoji: '👥', label: 'Ability to\nRally Others', id: 'rally_others' },
      { emoji: '🔁', label: 'Persistence\nin Goals', id: 'persistence' },
      { emoji: '🚀', label: 'Transformational\nThinking', id: 'transformational' },
      { emoji: '🦾', label: 'Confidence in\nInnovation', id: 'confidence_innovation' },
    ],
  },
  {
    title: 'Kindness Charisma',
    options: [
      { emoji: '🤗', label: 'Empathy', id: 'empathy' },
      { emoji: '☀️', label: 'Warmth', id: 'warmth' },
      { emoji: '💖', label: 'Compassion', id: 'compassion' },
      { emoji: '👋', label: 'Approachability', id: 'approachability' },
      { emoji: '🎁', label: 'Generosity', id: 'generosity' },
      { emoji: '🤝', label: 'Altruism', id: 'altruism' },
      { emoji: '👐', label: 'Selflessness', id: 'selflessness' },
      { emoji: '🌻', label: 'Encouragement', id: 'encouragement' },
    ],
  },
  {
    title: 'Focus Charisma',
    options: [
      { emoji: '👂', label: 'Deep\nListening', id: 'deep_listening' },
      { emoji: '🧘', label: 'Present\nMoment\nAttention', id: 'present_attention' },
      { emoji: '👀', label: 'Eye Contact', id: 'eye_contact' },
      { emoji: '🗨️', label: 'Engaged in\nConversation', id: 'engaged_conversation' },
      { emoji: '💬', label: 'Genuine\nInterest', id: 'genuine_interest' },
      { emoji: '🤔', label: 'Reflective\nResponses', id: 'reflective_responses' },
      { emoji: '🙌', label: 'Makes Others\nFeel Valued', id: 'makes_valued' },
      { emoji: '🧠', label: 'Mindfulness', id: 'mindfulness' },
    ],
  },
  {
    title: 'Personal Magnetism',
    options: [
      { emoji: '🌈', label: 'Unique\nPersonality', id: 'unique_personality' },
      { emoji: '📖', label: 'Interesting\nLife Story', id: 'life_story' },
      { emoji: '🎙️', label: 'Charismatic\nVoice/Tone', id: 'charismatic_voice' },
      { emoji: '😂', label: 'Humor', id: 'humor' },
      { emoji: '👗', label: 'Style or\nFashion Sense', id: 'style' },
      { emoji: '📚', label: 'Storytelling\nAbility', id: 'storytelling' },
      { emoji: '🔥', label: 'Passion\nExpression', id: 'passion_expression' },
      { emoji: '💫', label: 'Confidence\nWithout\nArrogance', id: 'humble_confidence' },
    ],
  },
  {
    title: 'Personal Presence',
    options: [
      { emoji: '⚡', label: 'Immediate\nImpact', id: 'immediate_impact' },
      { emoji: '😌', label: 'Calm\nConfidence', id: 'calm_confidence' },
      { emoji: '🙂', label: 'Friendly\nDemeanor', id: 'friendly_demeanor' },
      { emoji: '✨', label: 'Positive\nEnergy', id: 'positive_energy' },
      { emoji: '🧊', label: 'Composure\nUnder Pressure', id: 'composure' },
      { emoji: '💃', label: 'Body\nLanguage', id: 'body_language' },
      { emoji: '😊', label: 'Smile and\nWarmth', id: 'smile_warmth' },
      { emoji: '👀', label: 'Strong First\nImpression', id: 'first_impression' },
    ],
  },
  {
    title: 'Costly Signaling Charisma',
    options: [
      { emoji: '🎭', label: 'Social\nRisk-Taking', id: 'risk_taking' },
      { emoji: '😜', label: 'Wit and\nHumor', id: 'wit' },
      { emoji: '🗣️', label: 'Bold\nOpinions', id: 'bold_opinions' },
      { emoji: '😤', label: 'Self-Confidence\nDespite Criticism', id: 'confident_criticism' },
      { emoji: '❌', label: 'Non-Conformity', id: 'non_conformity' },
      { emoji: '🛡️', label: 'Resilience', id: 'resilience' },
      { emoji: '🧬', label: 'Authenticity', id: 'authenticity' },
      { emoji: '🦁', label: 'Courage', id: 'courage' },
    ],
  },
  {
    title: 'Countersignaling Charisma',
    options: [
      { emoji: '🙇‍♀️', label: 'Humility', id: 'humility' },
      { emoji: '🤡', label: 'Self-Deprecating\nHumor', id: 'self_deprecating' },
      { emoji: '🙏', label: 'Modesty', id: 'modesty' },
      { emoji: '🤝', label: 'Approachability', id: 'counter_approachability' },
      { emoji: '🏷️', label: 'Understated\nConfidence', id: 'understated_confidence' },
      { emoji: '🧑‍🤝‍🧑', label: 'Relatability', id: 'relatability' },
      { emoji: '💬', label: 'Disarming\nOthers', id: 'disarming' },
      { emoji: '🧘', label: 'Plays Down\nStatus', id: 'plays_down_status' },
    ],
  },
  {
    title: 'Fearsome Charisma',
    options: [
      { emoji: '🦾', label: 'Assertiveness', id: 'assertiveness' },
      { emoji: '🛡️', label: 'Strength with\nLikability', id: 'strength_likability' },
      { emoji: '🐅', label: 'Toughness', id: 'toughness' },
      { emoji: '🦅', label: 'Fearlessness', id: 'fearlessness' },
      { emoji: '🎯', label: 'Strategic\nDominance', id: 'strategic_dominance' },
      { emoji: '😎', label: 'Confidence in\nConfrontation', id: 'confrontation_confidence' },
      { emoji: '🦸', label: 'Strong Will', id: 'strong_will' },
      { emoji: '🧯', label: 'Charismatic\nCrisis Leadership', id: 'crisis_leadership' },
    ],
  },
  {
    title: 'Cult of Personality',
    options: [
      { emoji: '👑', label: 'Idolization', id: 'idolization' },
      { emoji: '📺', label: 'Media\nAmplification', id: 'media_amplification' },
      { emoji: '🕯️', label: 'Symbolism', id: 'symbolism' },
      { emoji: '❤️', label: 'Emotional\nAppeal', id: 'emotional_appeal' },
      { emoji: '🙏', label: 'Worship-Like\nAdmiration', id: 'worship_admiration' },
      { emoji: '📖', label: 'Charismatic\nStorytelling', id: 'charismatic_storytelling' },
      { emoji: '📰', label: 'Public Image\nCrafting', id: 'image_crafting' },
      { emoji: '🧑‍🤝‍🧑', label: 'Mobilization of\nFollowers', id: 'mobilization' },
    ],
  },
  {
    title: 'Inspirational Charisma',
    options: [
      { emoji: '🗣️', label: 'Motivational\nSpeaking', id: 'motivational_speaking' },
      { emoji: '🤝', label: 'Emotional\nConnection', id: 'emotional_connection' },
      { emoji: '🌞', label: 'Optimism', id: 'optimism' },
      { emoji: '✊', label: 'Encouragement', id: 'inspire_encouragement' },
      { emoji: '📜', label: 'Uplifting\nStories', id: 'uplifting_stories' },
      { emoji: '💥', label: 'Passion for\nGoals', id: 'passion_goals' },
      { emoji: '👩‍🏫', label: 'Teaching and\nMentoring', id: 'teaching_mentoring' },
      { emoji: '🎉', label: 'Rallying\nCollective Action', id: 'collective_action' },
    ],
  },
  {
    title: 'Servant Charisma',
    options: [
      { emoji: '🙌', label: 'Humble\nLeadership', id: 'humble_leadership' },
      { emoji: '🤲', label: 'Serving\nOthers First', id: 'serving_others' },
      { emoji: '🌱', label: 'Facilitating\nGrowth', id: 'facilitating_growth' },
      { emoji: '👂', label: 'Listening More\nThan Speaking', id: 'listening_speaking' },
      { emoji: '🫂', label: 'Building\nCommunity', id: 'building_community' },
      { emoji: '❤️', label: 'Authentic\nCare', id: 'authentic_care' },
      { emoji: '🤗', label: 'Supportive\nAttitude', id: 'supportive_attitude' },
      { emoji: '🌟', label: 'Leading by\nExample', id: 'leading_example' },
    ],
  },
  {
    title: 'Inspirational Charisma',
    options: [
      { emoji: '🗣️', label: 'Speaking\nHead', id: 'inspirational_speaking' },
      { emoji: '🙌', label: 'Raising\nHands', id: 'raising_hands' },
      { emoji: '🎉', label: 'Party\nPopper', id: 'party_popper' },
      { emoji: '🔥', label: 'Fire', id: 'inspirational_fire' },
      { emoji: '💡', label: 'Light\nBulb', id: 'inspirational_idea' },
      { emoji: '📣', label: 'Megaphone', id: 'megaphone' },
    ],
  },
  {
    title: 'Transformational Charisma',
    options: [
      { emoji: '🔄', label: 'Repeat\nButton', id: 'transformational_repeat' },
      { emoji: '🚀', label: 'Rocket', id: 'transformational_rocket' },
      { emoji: '🌱', label: 'Seedling', id: 'seedling' },
      { emoji: '🔧', label: 'Wrench', id: 'wrench' },
      { emoji: '🌟', label: 'Glowing\nStar', id: 'glowing_star' },
      { emoji: '⚙️', label: 'Gear', id: 'gear' },
    ],
  },
  {
    title: 'Ethical Charisma',
    options: [
      { emoji: '⚖️', label: 'Balance\nScale', id: 'balance_scale' },
      { emoji: '🧭', label: 'Compass', id: 'compass' },
      { emoji: '🤝', label: 'Handshake', id: 'ethical_handshake' },
      { emoji: '🕊️', label: 'Dove', id: 'dove' },
      { emoji: '🧘', label: 'Person in\nLotus Position', id: 'lotus_position' },
      { emoji: '💡', label: 'Light\nBulb', id: 'ethical_idea' },
    ],
  },
  {
    title: 'Socialized Charisma',
    options: [
      { emoji: '🤝', label: 'Handshake', id: 'socialized_handshake' },
      { emoji: '🌍', label: 'Globe Showing\nAmericas', id: 'globe' },
      { emoji: '👥', label: 'Busts in\nSilhouette', id: 'silhouette' },
      { emoji: '👐', label: 'Open\nHands', id: 'open_hands' },
      { emoji: '💬', label: 'Speech\nBalloon', id: 'speech_balloon' },
      { emoji: '🤗', label: 'Hugging\nFace', id: 'hugging_face' },
    ],
  },
  {
    title: 'Personalized Charisma',
    options: [
      { emoji: '🤑', label: 'Money-Mouth\nFace', id: 'money_mouth' },
      { emoji: '🎭', label: 'Performing\nArts', id: 'performing_arts' },
      { emoji: '😈', label: 'Smiling Face\nwith Horns', id: 'smiling_horns' },
      { emoji: '💎', label: 'Gem\nStone', id: 'gem_stone' },
      { emoji: '😎', label: 'Smiling Face\nwith Sunglasses', id: 'sunglasses' },
      { emoji: '💼', label: 'Briefcase', id: 'briefcase' },
    ],
  },
  {
    title: 'Neo-Charismatic Leadership',
    options: [
      { emoji: '🦾', label: 'Mechanical\nArm', id: 'mechanical_arm' },
      { emoji: '🔧', label: 'Wrench', id: 'neo_wrench' },
      { emoji: '🔄', label: 'Repeat\nButton', id: 'neo_repeat' },
      { emoji: '🛠️', label: 'Hammer and\nWrench', id: 'hammer_wrench' },
      { emoji: '⚙️', label: 'Gear', id: 'neo_gear' },
      { emoji: '📈', label: 'Chart\nIncreasing', id: 'chart_increasing' },
    ],
  },
  {
    title: 'Divine Charisma',
    options: [
      { emoji: '🛐', label: 'Place of\nWorship', id: 'place_worship' },
      { emoji: '👼', label: 'Baby\nAngel', id: 'baby_angel' },
      { emoji: '✨', label: 'Sparkles', id: 'sparkles' },
      { emoji: '🙏', label: 'Folded\nHands', id: 'folded_hands' },
      { emoji: '🌟', label: 'Glowing\nStar', id: 'divine_star' },
      { emoji: '🕯️', label: 'Candle', id: 'candle' },
    ],
  },
  {
    title: 'Office-holder Charisma',
    options: [
      { emoji: '🏛️', label: 'Classical\nBuilding', id: 'classical_building' },
      { emoji: '🎖️', label: 'Military\nMedal', id: 'military_medal' },
      { emoji: '👔', label: 'Necktie', id: 'necktie' },
      { emoji: '📜', label: 'Scroll', id: 'scroll' },
      { emoji: '💼', label: 'Briefcase', id: 'office_briefcase' },
      { emoji: '🧾', label: 'Receipt', id: 'receipt' },
    ],
  },
  {
    title: 'Star Power Charisma',
    options: [
      { emoji: '🌟', label: 'Glowing\nStar', id: 'star_power_star' },
      { emoji: '🎬', label: 'Clapper\nBoard', id: 'clapper_board' },
      { emoji: '🎤', label: 'Microphone', id: 'microphone' },
      { emoji: '🌠', label: 'Shooting\nStar', id: 'shooting_star' },
      { emoji: '⭐', label: 'Star', id: 'star' },
      { emoji: '📸', label: 'Camera With\nFlash', id: 'camera_flash' },
    ],
  },
  {
    title: 'Difficult/Disliked Charisma',
    options: [
      { emoji: '😠', label: 'Angry\nFace', id: 'angry_face' },
      { emoji: '🧨', label: 'Firecracker', id: 'firecracker' },
      { emoji: '😤', label: 'Face with\nSteam From Nose', id: 'steam_nose' },
      { emoji: '💣', label: 'Bomb', id: 'bomb' },
      { emoji: '⚡', label: 'High\nVoltage', id: 'high_voltage' },
      { emoji: '🔥', label: 'Fire', id: 'difficult_fire' },
    ],
  },
];

export default function OnboardingCharismaScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [selectedCharisma, setSelectedCharisma] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedCharisma) {
      return;
    }
    
    // Store selected charisma temporarily for the entry
    try {
      await AsyncStorage.setItem('@temp_selected_charisma', selectedCharisma);
    } catch (error) {
      console.error('Error storing charisma:', error);
    }
    
    // Navigate to emotions screen
    router.push('/onboarding-emotions');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Header with Logo and Title */}
      <View style={styles.header}>
        <CharismaLogo size={50} />
        <Text style={styles.appTitle}>Charisma Tracker</Text>
      </View>

      {/* Question and Subtitle */}
      <View style={styles.questionSection}>
        <Text style={styles.question}>How's your Charisma today?</Text>
        <Text style={styles.subtitle}>Choose 1 charisma</Text>
      </View>

      {/* Charisma Options by Category */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}>
        {charismaCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.grid}>
              {category.options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedCharisma === option.id && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedCharisma(option.id)}
                  activeOpacity={0.7}>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedCharisma && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedCharisma}
          activeOpacity={0.8}>
          <Text style={[
            styles.continueButtonText,
            !selectedCharisma && styles.continueButtonTextDisabled,
          ]}>
            Continue
          </Text>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  question: {
    fontSize: 24,
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
  optionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 32,
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
    gap: 16,
  },
  optionCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#2A2A2A',
    borderColor: '#F4C542',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
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
  continueButtonDisabled: {
    backgroundColor: '#3A3A3A',
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  continueButtonTextDisabled: {
    color: '#666666',
  },
});
