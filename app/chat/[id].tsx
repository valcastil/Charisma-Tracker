import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CharismaAttachmentModal } from '@/components/messages/charisma-attachment-modal';
import { WhatsAppBackground } from '@/components/ui/whatsapp-background';
import { Message, User } from '@/constants/message-types';
import { CharismaEntry } from '@/constants/theme';
import {
  sendMessage,
  getMessages,
  getCurrentUser,
  updateConversation,
} from '@/utils/message-utils';
import { formatCharismaEntryForMessage } from '@/utils/charisma-share-utils';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const { id, username, name } = params as { id: string; username: string; name: string };

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User>({
    id,
    username,
    name,
    isOnline: false,
  });
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      const [currentUserData, chatMessages] = await Promise.all([
        getCurrentUser(),
        getMessages(id),
      ]);
      
      setCurrentUser(currentUserData);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const chatMessages = await getMessages(id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentUser) return;

    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const newMessage = await sendMessage(
        otherUser.id,
        otherUser.username,
        otherUser.name,
        content
      );

      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setMessageText(content); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleAttachCharisma = (entry: CharismaEntry) => {
    // Format the charisma entry as a shareable message
    const charismaMessage = formatCharismaEntryForMessage(entry);
    
    // Set the formatted message as the message text
    setMessageText(charismaMessage);
  };

  const handleBack = () => {
    router.back();
  };

  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isFromCurrentUser = item.isFromCurrentUser;

    return (
      <View style={[
        styles.messageContainer,
        isFromCurrentUser ? styles.messageRight : styles.messageLeft
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isFromCurrentUser ? colors.messageBubble : colors.messageBubbleReceived,
            borderColor: colors.border,
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isFromCurrentUser ? '#FFFFFF' : colors.text }
          ]}>
            {item.content}
          </Text>
          {!isFromCurrentUser && (
            <Text style={[
              styles.messageTime,
              { 
                color: colors.textSecondary,
                textAlign: 'left'
              }
            ]}>
              {formatMessageTime(item.timestamp)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={[styles.dateSeparatorLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.dateSeparatorText, { color: colors.textSecondary }]}>
        {date}
      </Text>
      <View style={[styles.dateSeparatorLine, { backgroundColor: colors.border }]} />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      {/* Header with solid background */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}>
          <IconSymbol size={24} name="chevron.left" color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>
            {otherUser.name}
          </Text>
          <Text style={[styles.headerUsername, { color: colors.textSecondary }]}>
            @{otherUser.username}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.7}>
          <IconSymbol size={24} name="ellipsis" color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages area with background */}
      <WhatsAppBackground>
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol size={64} name="message" color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No messages yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Start the conversation with a message
              </Text>
            </View>
          }
        />

        {/* Message Input */}
        <View style={[styles.messageInputContainer, { borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowAttachmentModal(true)}
              activeOpacity={0.7}>
              <IconSymbol size={20} name="paperclip" color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.messageInput, { color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
              editable={!sending}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: messageText.trim() ? colors.gold : colors.border }
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
              activeOpacity={0.8}>
              {sending ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <IconSymbol size={20} name="paperplane" color={messageText.trim() ? '#000000' : colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Charisma Attachment Modal */}
        <CharismaAttachmentModal
          visible={showAttachmentModal}
          onClose={() => setShowAttachmentModal(false)}
          onAttach={handleAttachCharisma}
        />
      </WhatsAppBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerUsername: {
    fontSize: 14,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  messagesList: {
    padding: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4,
  },
  messageLeft: {
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
  },
  dateSeparatorText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  attachButton: {
    padding: 4,
    marginBottom: 4,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
