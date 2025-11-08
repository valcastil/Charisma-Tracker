import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, Conversation, User } from '@/constants/message-types';

const MESSAGES_KEY = '@charisma_messages';
const CONVERSATIONS_KEY = '@charisma_conversations';
const USERS_KEY = '@charisma_registered_users';
const CURRENT_USER_KEY = '@charisma_current_user';

// Get current user profile
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const profileData = await AsyncStorage.getItem('@charisma_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      return {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        isOnline: true,
        lastSeen: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get all registered users (in a real app, this would come from a server)
export const getRegisteredUsers = async (): Promise<User[]> => {
  try {
    const usersData = await AsyncStorage.getItem(USERS_KEY);
    if (usersData) {
      return JSON.parse(usersData);
    }
    
    // If no users exist, create some demo users for testing
    const demoUsers: User[] = [
      {
        id: 'demo_user_1',
        username: 'user_0000002',
        name: 'Alex Johnson',
        isOnline: true,
        lastSeen: Date.now(),
      },
      {
        id: 'demo_user_2',
        username: 'user_0000003',
        name: 'Sarah Williams',
        isOnline: false,
        lastSeen: Date.now() - 3600000, // 1 hour ago
      },
      {
        id: 'demo_user_3',
        username: 'user_0000004',
        name: 'Mike Chen',
        isOnline: true,
        lastSeen: Date.now() - 1800000, // 30 minutes ago
      },
      {
        id: 'demo_user_4',
        username: 'user_0000005',
        name: 'Emma Davis',
        isOnline: false,
        lastSeen: Date.now() - 7200000, // 2 hours ago
      },
    ];
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    return demoUsers;
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

// Register current user in the users list
export const registerCurrentUser = async (): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const users = await getRegisteredUsers();
    const existingUserIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = { ...currentUser, isOnline: true, lastSeen: Date.now() };
    } else {
      users.push({ ...currentUser, isOnline: true, lastSeen: Date.now() });
    }
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error registering current user:', error);
  }
};

// Send a message
export const sendMessage = async (
  receiverId: string,
  receiverUsername: string,
  receiverName: string,
  content: string
): Promise<Message> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('No current user found');
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      receiverId: receiverId,
      receiverUsername: receiverUsername,
      receiverName: receiverName,
      content: content.trim(),
      timestamp: Date.now(),
      date: now.toLocaleDateString(),
      time: timeString,
      isRead: false,
      isFromCurrentUser: true,
    };

    // Save message
    const messagesData = await AsyncStorage.getItem(MESSAGES_KEY);
    const messages: Message[] = messagesData ? JSON.parse(messagesData) : [];
    messages.push(newMessage);
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    // Update conversation
    await updateConversation(newMessage);

    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages between current user and another user
export const getMessages = async (otherUserId: string): Promise<Message[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const messagesData = await AsyncStorage.getItem(MESSAGES_KEY);
    const allMessages: Message[] = messagesData ? JSON.parse(messagesData) : [];

    const conversationMessages = allMessages.filter(
      msg => 
        (msg.senderId === currentUser.id && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === currentUser.id)
    );

    // Mark messages as read
    const unreadMessages = conversationMessages.filter(
      msg => !msg.isRead && msg.senderId === otherUserId
    );

    if (unreadMessages.length > 0) {
      await markMessagesAsRead(unreadMessages.map(msg => msg.id));
    }

    return conversationMessages.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Get all conversations for current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const conversationsData = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = conversationsData ? JSON.parse(conversationsData) : [];

    return conversations
      .filter(conv => conv.participantId !== currentUser.id)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

// Update or create conversation
export const updateConversation = async (message: Message): Promise<void> => {
  try {
    const conversationsData = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = conversationsData ? JSON.parse(conversationsData) : [];

    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    // Determine the other participant
    const otherParticipantId = message.senderId === currentUser.id ? 
      message.receiverId : message.senderId;
    const otherParticipantUsername = message.senderId === currentUser.id ? 
      message.receiverUsername : message.senderUsername;
    const otherParticipantName = message.senderId === currentUser.id ? 
      message.receiverName : message.senderName;

    const existingIndex = conversations.findIndex(
      conv => conv.participantId === otherParticipantId
    );

    const conversation: Conversation = {
      id: `${currentUser.id}_${otherParticipantId}`,
      participantId: otherParticipantId,
      participantUsername: otherParticipantUsername,
      participantName: otherParticipantName,
      lastMessage: message,
      unreadCount: message.senderId !== currentUser.id && !message.isRead ? 1 : 0,
      updatedAt: message.timestamp,
    };

    if (existingIndex >= 0) {
      // Update existing conversation
      conversations[existingIndex] = {
        ...conversations[existingIndex],
        lastMessage: message,
        updatedAt: message.timestamp,
        unreadCount: message.senderId !== currentUser.id && !message.isRead ? 
          conversations[existingIndex].unreadCount + 1 : 
          0,
      };
    } else {
      // Add new conversation
      conversations.push(conversation);
    }

    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error updating conversation:', error);
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
  try {
    const messagesData = await AsyncStorage.getItem(MESSAGES_KEY);
    const messages: Message[] = messagesData ? JSON.parse(messagesData) : [];

    messageIds.forEach(id => {
      const messageIndex = messages.findIndex(msg => msg.id === id);
      if (messageIndex >= 0) {
        messages[messageIndex].isRead = true;
      }
    });

    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

// Delete conversation
export const deleteConversation = async (participantId: string): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    // Delete messages
    const messagesData = await AsyncStorage.getItem(MESSAGES_KEY);
    const messages: Message[] = messagesData ? JSON.parse(messagesData) : [];
    const filteredMessages = messages.filter(
      msg => !(
        (msg.senderId === currentUser.id && msg.receiverId === participantId) ||
        (msg.senderId === participantId && msg.receiverId === currentUser.id)
      )
    );
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(filteredMessages));

    // Delete conversation
    const conversationsData = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    const conversations: Conversation[] = conversationsData ? JSON.parse(conversationsData) : [];
    const filteredConversations = conversations.filter(
      conv => conv.participantId !== participantId
    );
    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filteredConversations));
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};

// Get unread message count
export const getUnreadCount = async (): Promise<number> => {
  try {
    const conversations = await getConversations();
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
