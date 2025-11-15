import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, CharismaEntry } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CharismaLogo } from '@/components/charisma-logo';

const ENTRIES_KEY = '@charisma_entries';

// Inspirational Charisma Quotes
const CHARISMA_QUOTES = [
  "Charisma is the transference of enthusiasm.",
  "I'm really tall when I stand on my charisma.",
  "Charisma is the perfect blend of warmth and confidence.",
  "Awaken your charisma from within.",
  "People who love life have charisma because they fill the room with positive energy.",
  "Let your confidence shine—it's contagious.",
  "You light up the room by being boldly yourself.",
  "Energy and passion are your daily charisma boosters.",
  "Radiate positivity and watch the world respond.",
  "Stand tall, your charisma speaks volumes.",
];

// Map charisma IDs to readable names
const charismaNames: { [key: string]: string } = {
  commanding: 'Commanding Presence',
  confidence: 'Confidence',
  expertise: 'Expertise',
  decisiveness: 'Decisiveness',
  leadership: 'Leadership Aura',
  competence: 'Recognized Competence',
  influence: 'Influence Through Power',
  respect: 'Respect from Others',
  bold_ideas: 'Bold Ideas',
  inspiring_vision: 'Inspiring Vision',
  creativity: 'Creativity',
  passionate_future: 'Passionate About Future',
  rally_others: 'Ability to Rally Others',
  persistence: 'Persistence in Goals',
  transformational: 'Transformational Thinking',
  confidence_innovation: 'Confidence in Innovation',
  empathy: 'Empathy',
  warmth: 'Warmth',
  compassion: 'Compassion',
  approachability: 'Approachability',
  generosity: 'Generosity',
  altruism: 'Altruism',
  selflessness: 'Selflessness',
  encouragement: 'Encouragement',
  deep_listening: 'Deep Listening',
  present_attention: 'Present Moment Attention',
  eye_contact: 'Eye Contact',
  engaged_conversation: 'Engaged in Conversation',
  genuine_interest: 'Genuine Interest',
  reflective_responses: 'Reflective Responses',
  makes_valued: 'Makes Others Feel Valued',
  mindfulness: 'Mindfulness',
  unique_personality: 'Unique Personality',
  life_story: 'Interesting Life Story',
  charismatic_voice: 'Charismatic Voice/Tone',
  humor: 'Humor',
  style: 'Style or Fashion Sense',
  storytelling: 'Storytelling Ability',
  passion_expression: 'Passion Expression',
  humble_confidence: 'Confidence Without Arrogance',
  immediate_impact: 'Immediate Impact',
  calm_confidence: 'Calm Confidence',
  friendly_demeanor: 'Friendly Demeanor',
  positive_energy: 'Positive Energy',
  composure: 'Composure Under Pressure',
  body_language: 'Body Language',
  smile_warmth: 'Smile and Warmth',
  first_impression: 'Strong First Impression',
  risk_taking: 'Social Risk-Taking',
  wit: 'Wit and Humor',
  bold_opinions: 'Bold Opinions',
  confident_criticism: 'Self-Confidence Despite Criticism',
  non_conformity: 'Non-Conformity',
  resilience: 'Resilience',
  authenticity: 'Authenticity',
  courage: 'Courage',
  humility: 'Humility',
  self_deprecating: 'Self-Deprecating Humor',
  modesty: 'Modesty',
  counter_approachability: 'Approachability',
  understated_confidence: 'Understated Confidence',
  relatability: 'Relatability',
  disarming: 'Disarming Others',
  plays_down_status: 'Plays Down Status',
  assertiveness: 'Assertiveness',
  strength_likability: 'Strength with Likability',
  toughness: 'Toughness',
  fearlessness: 'Fearlessness',
  strategic_dominance: 'Strategic Dominance',
  confrontation_confidence: 'Confidence in Confrontation',
  strong_will: 'Strong Will',
  crisis_leadership: 'Charismatic Crisis Leadership',
  idolization: 'Idolization',
  media_amplification: 'Media Amplification',
  symbolism: 'Symbolism',
  emotional_appeal: 'Emotional Appeal',
  worship_admiration: 'Worship-Like Admiration',
  charismatic_storytelling: 'Charismatic Storytelling',
  image_crafting: 'Public Image Crafting',
  mobilization: 'Mobilization of Followers',
  motivational_speaking: 'Motivational Speaking',
  emotional_connection: 'Emotional Connection',
  optimism: 'Optimism',
  inspire_encouragement: 'Encouragement',
  uplifting_stories: 'Uplifting Stories',
  passion_goals: 'Passion for Goals',
  teaching_mentoring: 'Teaching and Mentoring',
  collective_action: 'Rallying Collective Action',
  humble_leadership: 'Humble Leadership',
  serving_others: 'Serving Others First',
  facilitating_growth: 'Facilitating Growth',
  listening_speaking: 'Listening More Than Speaking',
  building_community: 'Building Community',
  authentic_care: 'Authentic Care',
  supportive_attitude: 'Supportive Attitude',
  leading_example: 'Leading by Example',
  // Inspirational Charisma
  inspirational_speaking: 'Speaking Head',
  raising_hands: 'Raising Hands',
  party_popper: 'Party Popper',
  inspirational_fire: 'Fire',
  inspirational_idea: 'Light Bulb',
  megaphone: 'Megaphone',
  // Transformational Charisma
  transformational_repeat: 'Repeat Button',
  transformational_rocket: 'Rocket',
  seedling: 'Seedling',
  wrench: 'Wrench',
  glowing_star: 'Glowing Star',
  gear: 'Gear',
  // Ethical Charisma
  balance_scale: 'Balance Scale',
  compass: 'Compass',
  ethical_handshake: 'Handshake',
  dove: 'Dove',
  lotus_position: 'Person in Lotus Position',
  ethical_idea: 'Light Bulb',
  // Socialized Charisma
  socialized_handshake: 'Handshake',
  globe: 'Globe Showing Americas',
  silhouette: 'Busts in Silhouette',
  open_hands: 'Open Hands',
  speech_balloon: 'Speech Balloon',
  hugging_face: 'Hugging Face',
  // Personalized Charisma
  money_mouth: 'Money-Mouth Face',
  performing_arts: 'Performing Arts',
  smiling_horns: 'Smiling Face with Horns',
  gem_stone: 'Gem Stone',
  sunglasses: 'Smiling Face with Sunglasses',
  briefcase: 'Briefcase',
  // Neo-Charismatic Leadership
  mechanical_arm: 'Mechanical Arm',
  neo_wrench: 'Wrench',
  neo_repeat: 'Repeat Button',
  hammer_wrench: 'Hammer and Wrench',
  neo_gear: 'Gear',
  chart_increasing: 'Chart Increasing',
  // Divine Charisma
  place_worship: 'Place of Worship',
  baby_angel: 'Baby Angel',
  sparkles: 'Sparkles',
  folded_hands: 'Folded Hands',
  divine_star: 'Glowing Star',
  candle: 'Candle',
  // Office-holder Charisma
  classical_building: 'Classical Building',
  military_medal: 'Military Medal',
  necktie: 'Necktie',
  scroll: 'Scroll',
  office_briefcase: 'Briefcase',
  receipt: 'Receipt',
  // Star Power Charisma
  star_power_star: 'Glowing Star',
  clapper_board: 'Clapper Board',
  microphone: 'Microphone',
  shooting_star: 'Shooting Star',
  star: 'Star',
  camera_flash: 'Camera With Flash',
  // Difficult/Disliked Charisma
  angry_face: 'Angry Face',
  firecracker: 'Firecracker',
  steam_nose: 'Face with Steam From Nose',
  bomb: 'Bomb',
  high_voltage: 'High Voltage',
  difficult_fire: 'Fire',
};

// Map charisma IDs to emojis
const charismaEmojis: { [key: string]: string } = {
  commanding: '👑',
  confidence: '💪',
  expertise: '📚',
  decisiveness: '🕴️',
  leadership: '🧑‍💼',
  competence: '🏆',
  influence: '🗣️',
  respect: '🙇‍♂️',
  bold_ideas: '🌟',
  inspiring_vision: '🔮',
  creativity: '🎨',
  passionate_future: '❤️',
  rally_others: '👥',
  persistence: '🔁',
  transformational: '🚀',
  confidence_innovation: '🦾',
  empathy: '🤗',
  warmth: '☀️',
  compassion: '💖',
  approachability: '👋',
  generosity: '🎁',
  altruism: '🤝',
  selflessness: '👐',
  encouragement: '🌻',
  deep_listening: '👂',
  present_attention: '🧘',
  eye_contact: '👀',
  engaged_conversation: '🗨️',
  genuine_interest: '💬',
  reflective_responses: '🤔',
  makes_valued: '🙌',
  mindfulness: '🧠',
  unique_personality: '🌈',
  life_story: '📖',
  charismatic_voice: '🎙️',
  humor: '😂',
  style: '👗',
  storytelling: '📚',
  passion_expression: '🔥',
  humble_confidence: '💫',
  immediate_impact: '⚡',
  calm_confidence: '😌',
  friendly_demeanor: '🙂',
  positive_energy: '✨',
  composure: '🧊',
  body_language: '💃',
  smile_warmth: '😊',
  first_impression: '👀',
  risk_taking: '🎭',
  wit: '😜',
  bold_opinions: '🗣️',
  confident_criticism: '😤',
  non_conformity: '❌',
  resilience: '🛡️',
  authenticity: '🧬',
  courage: '🦁',
  humility: '🙇‍♀️',
  self_deprecating: '🤡',
  modesty: '🙏',
  counter_approachability: '🤝',
  understated_confidence: '🏷️',
  relatability: '🧑‍🤝‍🧑',
  disarming: '💬',
  plays_down_status: '🧘',
  assertiveness: '🦾',
  strength_likability: '🛡️',
  toughness: '🐅',
  fearlessness: '🦅',
  strategic_dominance: '🎯',
  confrontation_confidence: '😎',
  strong_will: '🦸',
  crisis_leadership: '🧯',
  idolization: '👑',
  media_amplification: '📺',
  symbolism: '🕯️',
  emotional_appeal: '❤️',
  worship_admiration: '🙏',
  charismatic_storytelling: '📖',
  image_crafting: '📰',
  mobilization: '🧑‍🤝‍🧑',
  motivational_speaking: '🗣️',
  emotional_connection: '🤝',
  optimism: '🌞',
  inspire_encouragement: '✊',
  uplifting_stories: '📜',
  passion_goals: '💥',
  teaching_mentoring: '👩‍🏫',
  collective_action: '🎉',
  humble_leadership: '🙌',
  serving_others: '🤲',
  facilitating_growth: '🌱',
  listening_speaking: '👂',
  building_community: '🫂',
  authentic_care: '❤️',
  supportive_attitude: '🤗',
  leading_example: '🌟',
  // Inspirational Charisma
  inspirational_speaking: '🗣️',
  raising_hands: '🙌',
  party_popper: '🎉',
  inspirational_fire: '🔥',
  inspirational_idea: '💡',
  megaphone: '📣',
  // Transformational Charisma
  transformational_repeat: '🔄',
  transformational_rocket: '🚀',
  seedling: '🌱',
  wrench: '🔧',
  glowing_star: '🌟',
  gear: '⚙️',
  // Ethical Charisma
  balance_scale: '⚖️',
  compass: '🧭',
  ethical_handshake: '🤝',
  dove: '🕊️',
  lotus_position: '🧘',
  ethical_idea: '💡',
  // Socialized Charisma
  socialized_handshake: '🤝',
  globe: '🌍',
  silhouette: '👥',
  open_hands: '👐',
  speech_balloon: '💬',
  hugging_face: '🤗',
  // Personalized Charisma
  money_mouth: '🤑',
  performing_arts: '🎭',
  smiling_horns: '😈',
  gem_stone: '💎',
  sunglasses: '😎',
  briefcase: '💼',
  // Neo-Charismatic Leadership
  mechanical_arm: '🦾',
  neo_wrench: '🔧',
  neo_repeat: '🔄',
  hammer_wrench: '🛠️',
  neo_gear: '⚙️',
  chart_increasing: '📈',
  // Divine Charisma
  place_worship: '🛐',
  baby_angel: '👼',
  sparkles: '✨',
  folded_hands: '🙏',
  divine_star: '🌟',
  candle: '🕯️',
  // Office-holder Charisma
  classical_building: '🏛️',
  military_medal: '🎖️',
  necktie: '👔',
  scroll: '📜',
  office_briefcase: '💼',
  receipt: '🧾',
  // Star Power Charisma
  star_power_star: '🌟',
  clapper_board: '🎬',
  microphone: '🎤',
  shooting_star: '🌠',
  star: '⭐',
  camera_flash: '📸',
  // Difficult/Disliked Charisma
  angry_face: '😠',
  firecracker: '🧨',
  steam_nose: '😤',
  bomb: '💣',
  high_voltage: '⚡',
  difficult_fire: '🔥',
};

// Map emotion IDs to emojis
const emotionEmojis: { [key: string]: string } = {
  // Confidence & Power
  flexed_biceps: '💪',
  crown: '👑',
  lion: '🦁',
  trophy: '🏆',
  high_voltage: '⚡',
  sunglasses: '😎',
  man_suit: '🕴️',
  brain: '🧠',
  // Warmth & Kindness
  hugging_face: '🤗',
  sun: '☀️',
  sunflower: '🌻',
  sparkling_heart: '💖',
  rainbow: '🌈',
  handshake: '🤝',
  dove: '🕊️',
  open_hands: '👐',
  // Inspiration & Motivation
  rocket: '🚀',
  glowing_star: '🌟',
  fire: '🔥',
  sparkles: '✨',
  sun_face: '🌞',
  party_popper: '🎉',
  speaking_head: '🗣️',
  direct_hit: '🎯',
  // Focus & Presence
  eyes: '👀',
  ear: '👂',
  lotus_position: '🧘',
  brain_focus: '🧠',
  speech_bubble: '🗨️',
  raising_hands: '🙌',
  thinking_face: '🤔',
  speech_balloon: '💬',
  // Humor & Playfulness
  tears_joy: '😂',
  winking_tongue: '😜',
  clown_face: '🤡',
  rolling_laughing: '🤣',
  grinning_squinting: '😆',
  performing_arts: '🎭',
  smirking_face: '😏',
  upside_down: '🙃',
  // Humility & Relatability
  folded_hands: '🙏',
  people_holding: '🧑‍🤝‍🧑',
  handshake_humble: '🤝',
  pleading_face: '🥺',
  palms_up: '🤲',
  smiling_face: '😊',
  hugging_humble: '🤗',
  shushing_face: '🤫',
  // Courage & Boldness
  eagle: '🦅',
  superhero: '🦸',
  shield: '🛡️',
  dagger: '🗡️',
  mechanical_arm: '🦾',
  target: '🎯',
  fire_bold: '🔥',
  collision: '💥',
};

export default function AddEntryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);

  const handleSelectQuote = (quote: string) => {
    // Add quote to message with proper spacing
    const newMessage = message.trim() 
      ? `${message.trim()}\n\n${quote}` 
      : quote;
    setMessage(newMessage);
    setShowQuotesModal(false);
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      // Load selected charisma
      const selectedCharismaId = await AsyncStorage.getItem('@temp_selected_charisma');
      const charismaName = selectedCharismaId 
        ? charismaNames[selectedCharismaId] || 'Charisma Entry'
        : 'Charisma Entry';
      const charismaEmoji = selectedCharismaId 
        ? charismaEmojis[selectedCharismaId] || '✨'
        : '✨';

      // Load selected emotions
      const selectedEmotionsData = await AsyncStorage.getItem('@temp_selected_emotions');
      const selectedEmotionIds: string[] = selectedEmotionsData 
        ? JSON.parse(selectedEmotionsData) 
        : [];
      const selectedEmotionEmojis = selectedEmotionIds.map(id => emotionEmojis[id] || '');

      // Load existing entries
      const entriesData = await AsyncStorage.getItem(ENTRIES_KEY);
      const entries: CharismaEntry[] = entriesData ? JSON.parse(entriesData) : [];

      // Get current time
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      // Create new entry with the message as notes
      const newEntry: CharismaEntry = {
        id: Date.now().toString(),
        majorCharisma: selectedCharismaId || 'confidence',
        subCharisma: '',
        notes: message.trim(),
        timestamp: Date.now(),
        date: now.toLocaleDateString(),
        time: timeString,
        charismaEmoji: charismaEmoji,
        emotionEmojis: selectedEmotionEmojis,
      };

      // Add to beginning of array
      const updatedEntries = [newEntry, ...entries];

      // Save to storage
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updatedEntries));

      // Clear temporary selections
      await AsyncStorage.removeItem('@temp_selected_charisma');
      await AsyncStorage.removeItem('@temp_selected_emotions');

      // Navigate back to home
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#000000' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header with Logo and Title */}
      <View style={styles.header}>
        <CharismaLogo size={60} />
        <Text style={styles.appTitle}>Charisma Tracker</Text>
      </View>

      {/* Question and Subtitle */}
      <View style={styles.questionSection}>
        <Text style={styles.question}>Anything you wanna share?</Text>
        <Text style={styles.subtitle}>Write down below</Text>
      </View>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="enter the situation here"
          placeholderTextColor="#666666"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
          autoFocus
        />
        {/* Add Quote Button */}
        <TouchableOpacity
          style={styles.addQuoteButton}
          onPress={() => setShowQuotesModal(true)}
          activeOpacity={0.8}>
          <Text style={styles.addQuoteButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={saving}
          activeOpacity={0.8}>
          <Text style={styles.continueButtonText}>
            {saving ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quotes Modal */}
      <Modal
        visible={showQuotesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuotesModal(false)}>
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowQuotesModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>✨ Inspirational Quotes</Text>
              <TouchableOpacity
                onPress={() => setShowQuotesModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.quotesScrollView} showsVerticalScrollIndicator={false}>
              {CHARISMA_QUOTES.map((quote, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quoteItem}
                  onPress={() => handleSelectQuote(quote)}
                  activeOpacity={0.7}>
                  <Text style={styles.quoteText}>{quote}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
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
  inputContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  addQuoteButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4C542',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F4C542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addQuoteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    fontSize: 28,
    color: '#999999',
    fontWeight: '300',
  },
  quotesScrollView: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  quoteItem: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F4C542',
  },
  quoteText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
});
