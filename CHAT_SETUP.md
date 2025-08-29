# Real-Time Chat Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Socket.IO Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# API Base URL (if different from socket URL)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Backend Requirements

Your Node.js/Express backend should implement the following:

### Socket.IO Setup
```javascript
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// JWT Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.userId;
    socket.user = decoded;
    next();
  });
});
```

### Socket Events to Implement

#### Client → Server Events:
- `join_chat_room` - Join a specific chat room
- `send_message` - Send a message to a room
- `get_chat_history` - Request chat history for a room
- `typing` - Send typing indicators
- `leave_room` - Leave a chat room

#### Server → Client Events:
- `receive_message` - Broadcast new message to room
- `chat_history` - Send chat history to client
- `joined_room` - Confirm room join
- `user_typing` - Broadcast typing indicators
- `error` - Send error messages
- `user_joined` - Notify when user joins room
- `user_left` - Notify when user leaves room

### API Endpoints

#### GET `/api/chat/history/:projectId/:roomId`
Get chat history for a specific room.

#### GET `/api/chat/my-chats`
Get user's chat list.

#### POST `/api/chat/generate-room`
Generate a new chat room ID.

#### POST `/api/chat/send-message`
Send a message (alternative to socket).

### Room ID Format
Room IDs should follow the format: `projectId_founderId_contributorId`

### Message Object Structure
```typescript
interface Message {
  _id: string;
  roomId: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}
```

## Frontend Features Implemented

✅ **Real-time messaging** - Instant message delivery
✅ **Message persistence** - Chat history loading
✅ **Typing indicators** - Real-time typing status
✅ **Auto-scroll** - Automatic scroll to latest messages
✅ **Error handling** - Graceful error management
✅ **Responsive design** - Mobile-friendly interface
✅ **JWT authentication** - Secure socket connections
✅ **Connection management** - Auto-reconnect on disconnect
✅ **Chat room generation** - Dynamic room creation
✅ **User avatars** - Visual user identification

## Usage

The chat functionality is now integrated into the applications page. Founders can:

1. View applicant profiles
2. Click "Message [Applicant Name]" button
3. Chat in real-time with applicants
4. See typing indicators
5. View chat history

## Components Created

- `ChatProvider` - Context for chat state management
- `ChatWindow` - Main chat interface component
- `ChatButton` - Button to open chat for specific users
- `SocketService` - Socket.IO connection management
- `chatApiSlice` - RTK Query endpoints for chat API

## Next Steps

1. Set up your Node.js backend with Socket.IO
2. Implement the required API endpoints
3. Configure environment variables
4. Test the chat functionality
5. Deploy and configure production URLs 