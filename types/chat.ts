export interface Message {
  _id: string;
  roomId: string;
  senderId: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  message: string;
  type: 'text' | 'system';
}

export interface ChatRoom {
  _id: string;
  roomId: string;
  projectId: string;
  founderId: string;
  contributorId: string;
  project: {
    _id: string;
    title: string;
  };
  founder: {
    _id: string;
    name: string;
  };
  contributor: {
    _id: string;
    name: string;
  };
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatHistoryResponse {
  messages: Message[];
  room: ChatRoom;
}

export interface GenerateRoomRequest {
  projectId: string;
  contributorId: string;
}

export interface GenerateRoomResponse {
  roomId: string;
  room: ChatRoom;
}

export interface SendMessageRequest {
  senderId?: string;
  roomId?: string;
  projectId: string;
  message?: string;

  messageType?: 'text' | 'file' | 'poll' | 'system';
  content?: string; // required when messageType === 'text'
  applicationId?: string;
}

export interface TypingEvent {
  roomId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

// Socket Events
export interface SocketEvents {
  // Client to Server
  'join_chat_room': (data: { roomId: string; projectId: string; applicationId?: string }) => void;
  'send_message': (data: SendMessageRequest) => void;
  'get_chat_history': (data: { roomId: string; projectId: string; applicationId?: string }) => void;
  'typing': (data: TypingEvent) => void;
  'leave_room': (roomId: string) => void;

  // Server to Client
  'receive_message': (message: Message) => void;
  'chat_history': (data: ChatHistoryResponse) => void;
  'joined_room': (roomId: string) => void;
  'user_typing': (data: TypingEvent) => void;
  'error': (error: { message: string; code?: string }) => void;
  'user_joined': (userId: string) => void;
  'user_left': (userId: string) => void;
}

export interface ChatState {
  currentRoom: string | null; // just the roomId
  messages: Message[];
  typingUsers: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface ChatContextType {
  state: ChatState;
  joinRoom: (roomId: string, projectId: string, applicationId?: string) => Promise<void>;
  leaveRoom: () => void;
  sendMessage: (content: string, projectId: string, applicationId?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
  loadChatHistory: (roomId: string, projectId: string, applicationId?: string) => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  generateChatRoom: (projectId: string, contributorId: string) => Promise<string>;
} 