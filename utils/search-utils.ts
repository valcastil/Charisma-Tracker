import { CharismaEntry } from '@/constants/theme';

// Map charisma IDs to readable names (same as in add-entry.tsx)
export const charismaNames: { [key: string]: string } = {
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

// Map emotion IDs to emojis (same as in add-entry.tsx)
export const emotionEmojis: { [key: string]: string } = {
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

// Map emotion IDs to readable names
export const emotionNames: { [key: string]: string } = {
  // Confidence & Power
  flexed_biceps: 'Flexed Biceps',
  crown: 'Crown',
  lion: 'Lion',
  trophy: 'Trophy',
  high_voltage: 'High Voltage',
  sunglasses: 'Sunglasses',
  man_suit: 'Man in Suit',
  brain: 'Brain',
  // Warmth & Kindness
  hugging_face: 'Hugging Face',
  sun: 'Sun',
  sunflower: 'Sunflower',
  sparkling_heart: 'Sparkling Heart',
  rainbow: 'Rainbow',
  handshake: 'Handshake',
  dove: 'Dove',
  open_hands: 'Open Hands',
  // Inspiration & Motivation
  rocket: 'Rocket',
  glowing_star: 'Glowing Star',
  fire: 'Fire',
  sparkles: 'Sparkles',
  sun_face: 'Sun with Face',
  party_popper: 'Party Popper',
  speaking_head: 'Speaking Head',
  direct_hit: 'Direct Hit',
  // Focus & Presence
  eyes: 'Eyes',
  ear: 'Ear',
  lotus_position: 'Lotus Position',
  brain_focus: 'Brain Focus',
  speech_bubble: 'Speech Bubble',
  raising_hands: 'Raising Hands',
  thinking_face: 'Thinking Face',
  speech_balloon: 'Speech Balloon',
  // Humor & Playfulness
  tears_joy: 'Tears of Joy',
  winking_tongue: 'Winking Tongue',
  clown_face: 'Clown Face',
  rolling_laughing: 'Rolling Laughing',
  grinning_squinting: 'Grinning Squinting',
  performing_arts: 'Performing Arts',
  smirking_face: 'Smirking Face',
  upside_down: 'Upside-Down Face',
  // Humility & Relatability
  folded_hands: 'Folded Hands',
  people_holding: 'People Holding Hands',
  handshake_humble: 'Handshake',
  pleading_face: 'Pleading Face',
  palms_up: 'Palms Up',
  smiling_face: 'Smiling Face',
  hugging_humble: 'Hugging Face',
  shushing_face: 'Shushing Face',
  // Courage & Boldness
  eagle: 'Eagle',
  superhero: 'Superhero',
  shield: 'Shield',
  dagger: 'Dagger',
  mechanical_arm: 'Mechanical Arm',
  target: 'Target',
  fire_bold: 'Fire',
  collision: 'Collision',
};

export interface SearchResult {
  entry: CharismaEntry;
  matchedCharisma?: string;
  matchedEmotions?: string[];
  matchedNotes?: boolean;
}

export const searchEntries = (
  entries: CharismaEntry[], 
  query: string
): SearchResult[] => {
  if (!query.trim()) {
    return [];
  }

  const lowercaseQuery = query.toLowerCase().trim();

  return entries
    .map(entry => {
      const matches: SearchResult = { entry };

      // Search in charisma name
      const charismaName = charismaNames[entry.majorCharisma] || entry.majorCharisma;
      if (charismaName.toLowerCase().includes(lowercaseQuery)) {
        matches.matchedCharisma = charismaName;
      }

      // Search in sub-charisma
      if (entry.subCharisma && entry.subCharisma.toLowerCase().includes(lowercaseQuery)) {
        matches.matchedCharisma = entry.subCharisma;
      }

      // Search in emotion names
      const matchedEmotions: string[] = [];
      if (entry.emotionEmojis && entry.emotionEmojis.length > 0) {
        entry.emotionEmojis.forEach(emoji => {
          // Find emotion ID by emoji
          const emotionId = Object.keys(emotionEmojis).find(id => {
            const emotionEmoji = emotionEmojis[id] || '';
            return emotionEmoji === emoji;
          });
          
          if (emotionId) {
            const emotionName = emotionNames[emotionId];
            if (emotionName && emotionName.toLowerCase().includes(lowercaseQuery)) {
              matchedEmotions.push(emotionName);
            }
          }
        });
      }
      
      if (matchedEmotions.length > 0) {
        matches.matchedEmotions = matchedEmotions;
      }

      // Search in notes
      if (entry.notes && entry.notes.toLowerCase().includes(lowercaseQuery)) {
        matches.matchedNotes = true;
      }

      // Only include if there's at least one match
      if (matches.matchedCharisma || matches.matchedEmotions?.length || matches.matchedNotes) {
        return matches;
      }

      return null;
    })
    .filter((result): result is SearchResult => result !== null)
    .sort((a, b) => b.entry.timestamp - a.entry.timestamp); // Sort by most recent
};

export const getCharismaName = (charismaId: string): string => {
  return charismaNames[charismaId] || charismaId;
};

export const getEmotionName = (emotionEmoji: string): string | null => {
  const emotionId = Object.keys(emotionEmojis).find(id => emotionEmojis[id] === emotionEmoji);
  return emotionId ? emotionNames[emotionId] || null : null;
};
