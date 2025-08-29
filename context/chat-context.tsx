'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { ChatState, ChatContextType, Message, ChatRoom, TypingEvent } from '@/types/chat'
import socketService from '@/services/socketService'
import { useGetChatHistoryQuery } from '@/api/features/chat/chatApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/api/store'
import { toast } from '@/components/ui/use-toast'

// Initial state
const initialState: ChatState = {
  currentRoom: null, // just the roomId
  messages: [], // always an array
  typingUsers: [],
  isLoading: false,
  error: null,
  isConnected: false,
}

// Action types
type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CURRENT_ROOM'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TYPING_USERS'; payload: string[] }
  | { type: 'ADD_TYPING_USER'; payload: string }
  | { type: 'REMOVE_TYPING_USER'; payload: string }
  | { type: 'CLEAR_CHAT' }

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload }
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload }
    case 'SET_MESSAGES':
      return { ...state, messages: Array.isArray(action.payload) ? action.payload : [] }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'SET_TYPING_USERS':
      return { ...state, typingUsers: action.payload }
    case 'ADD_TYPING_USER':
      return { 
        ...state, 
        typingUsers: state.typingUsers.includes(action.payload) 
          ? state.typingUsers 
          : [...state.typingUsers, action.payload] 
      }
    case 'REMOVE_TYPING_USER':
      return { 
        ...state, 
        typingUsers: state.typingUsers.filter(user => user !== action.payload) 
      }
    case 'CLEAR_CHAT':
      return { 
        ...state, 
        messages: [], 
        typingUsers: [], 
        currentRoom: null 
      }
    default:
      return state
  }
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    // console.log('[ChatProvider] Mounted. User:', user)
    if (user && !state.isConnected) {
      connect()
    }
    return () => {
      // console.log('[ChatProvider] Unmounting. Disconnecting...')
      disconnect()
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    // console.log('[ChatProvider] Setting up socket event listeners')
    // Message received
    socketService.onReceiveMessage((message: Message) => {
      // console.log('[ChatProvider] Received message:', message)
      if (state.currentRoom && message.roomId === state.currentRoom) {
        dispatch({ type: 'ADD_MESSAGE', payload: message })
      }
    })

    socketService.onChatHistory((data: { messages: Message[]; room?: ChatRoom }) => {
      console.log('[ChatProvider] Received chat history:', data)
      dispatch({ type: 'SET_MESSAGES', payload: data.messages })

      console.log(data.room)
    
      if (data.room?.roomId) {
        dispatch({ type: 'SET_CURRENT_ROOM', payload: data.room.roomId })
      } else {
        console.warn('[ChatProvider] Missing roomId in chat history response:', data)
      }
    })
    
    // Joined room
    socketService.onJoinedRoom((roomId: string) => {
      // console.log('[ChatProvider] Joined room:', roomId)
    })

    // User typing
    socketService.onUserTyping((data: TypingEvent) => {
      // console.log('[ChatProvider] User typing event:', data)
      if (state.currentRoom && data.roomId === state.currentRoom) {
        if (data.isTyping) {
          dispatch({ type: 'ADD_TYPING_USER', payload: data.userName })
        } else {
          dispatch({ type: 'REMOVE_TYPING_USER', payload: data.userName })
        }
      }
    })

    // Error handling
    socketService.onError((error: any) => {
      // console.error('[ChatProvider] Socket error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Chat Error",
        description: error.message,
        variant: "destructive",
      })
    })

    // Connection status
    const checkConnection = () => {
      const connected = socketService.isConnected()
      // console.log('[ChatProvider] Connection status:', connected)
      dispatch({ type: 'SET_CONNECTED', payload: connected })
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000)

    return () => {
      clearInterval(interval)
      socketService.offReceiveMessage()
      socketService.offChatHistory()
      socketService.offJoinedRoom()
      socketService.offUserTyping()
      socketService.offError()
    }
  }, [user, state.currentRoom])

  const connect = useCallback(async () => {
    try {
      // console.log('[ChatProvider] Connecting to socket server...')
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      await socketService.connect()
      dispatch({ type: 'SET_CONNECTED', payload: true })
      // console.log('[ChatProvider] Connected!')
    } catch (error: any) {
      // console.error('[ChatProvider] Connection failed:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Connection Failed",
        description: "Failed to connect to chat server",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const disconnect = useCallback(() => {
    // console.log('[ChatProvider] Disconnecting from socket server...')
    socketService.disconnect()
    dispatch({ type: 'SET_CONNECTED', payload: false })
    dispatch({ type: 'CLEAR_CHAT' })
  }, [])

  const joinRoom = useCallback(async (roomId: string, projectId: string, applicationId?: string) => {
    if (!state.isConnected) {
      await connect()
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      // Leave current room if any
      if (state.currentRoom) {
        socketService.leaveRoom(state.currentRoom)
      }

      // Join new room
      socketService.joinChatRoom({ roomId, projectId, applicationId })
      
      // Get chat history
      socketService.getChatHistory({ roomId, projectId, applicationId })
      dispatch({ type: 'SET_CURRENT_ROOM', payload: roomId })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      toast({
        title: "Join Room Failed",
        description: "Failed to join chat room",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.isConnected, state.currentRoom, connect])

  const leaveRoom = useCallback(() => {
    if (state.currentRoom) {
      socketService.leaveRoom(state.currentRoom)
    }
    dispatch({ type: 'CLEAR_CHAT' })
    dispatch({ type: 'SET_CURRENT_ROOM', payload: null })
  }, [state.currentRoom])

  const sendMessage = useCallback((content: string, projectId: string, applicationId?: string) => {
    console.log('[ChatProvider] Sending message:', content)
    console.log('[ChatProvider] state.currentRoom:', state.currentRoom)
    if (!state.currentRoom || !content.trim() || !user) return

    console.log('[ChatProvider] user:', user)

    // Base payload for 1-on-1 compatibility
    const isGroupRoom = !!state.currentRoom && state.currentRoom.startsWith('group_')
    const messageData = {
      senderId: user._id,
      roomId: state.currentRoom,
      projectId,
      content: content.trim(),
      applicationId,
      // Add group-specific fields conditionally; harmless for 1-on-1 since optional
      ...(isGroupRoom
        ? {
            messageType: 'text' as const,
            content: content.trim(),
          }
        : {}),
    }

    console.log('[ChatProvider] messageData:', messageData)

    socketService.sendMessage(messageData)
  }, [state.currentRoom, user])

  const startTyping = useCallback(() => {
    if (!state.currentRoom || !user) return

    const typingData: TypingEvent = {
      roomId: state.currentRoom,
      userId: user._id,
      userName: user.name,
      isTyping: true
    }

    socketService.startTyping(typingData)
  }, [state.currentRoom, user])

  const stopTyping = useCallback(() => {
    if (!state.currentRoom || !user) return

    const typingData: TypingEvent = {
      roomId: state.currentRoom,
      userId: user._id,
      userName: user.name,
      isTyping: false
    }

    socketService.stopTyping(typingData)
  }, [state.currentRoom, user])

  const loadChatHistory = useCallback(async (roomId: string, projectId: string, applicationId?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      socketService.getChatHistory({ roomId, projectId, applicationId })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const generateChatRoom = useCallback(async (projectId: string, contributorId: string) => {
    try {
      // For now, generate room ID locally until backend is ready
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const roomId = `${projectId}_${user._id}_${contributorId}`
      return roomId
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive",
      })
      throw error
    }
  }, [])

  const value: ChatContextType = {
    state,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    loadChatHistory,
    connect,
    disconnect,
    generateChatRoom,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

// Hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  // console.log('[useChat] context:', context);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
}