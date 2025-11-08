export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  senderName: string;
  receiverId: string;
  receiverUsername: string;
  receiverName: string;
  content: string;
  timestamp: number;
  date: string;
  time: string;
  isRead: boolean;
  isFromCurrentUser: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantUsername: string;
  participantName: string;
  lastMessage: Message;
  unreadCount: number;
  updatedAt: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  isOnline?: boolean;
  lastSeen?: number;
}
