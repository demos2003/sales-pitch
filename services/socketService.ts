import { io, Socket } from 'socket.io-client'
import { SocketEvents, TypingEvent, SendMessageRequest } from '@/types/chat'

class SocketService {
  private socket: Socket | null = null
  private token: string | null = null
  private isConnecting = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.isConnecting = true
      const authToken = token || this.token

      if (!authToken) {
        this.isConnecting = false
        reject(new Error('No authentication token available'))
        return
      }

      try {
        this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
          auth: {
            token: authToken
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true
        })

        this.setupEventListeners()
        this.setupReconnection()

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id)
          this.isConnecting = false
          this.reconnectAttempts = 0
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          console.log('Socket connection error:', error)
          this.isConnecting = false
          reject(error)
        })

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason)
          if (reason === 'io server disconnect') {
            // Server disconnected us, try to reconnect
            this.reconnect()
          }
        })

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('error', (error) => {
      console.log('Socket error:', error)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts')
    })

    this.socket.on('reconnect_error', (error) => {
      console.log('Socket reconnection error:', error)
    })
  }

  private setupReconnection() {
    if (!this.socket) return

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io client disconnect') {
        // Client disconnected intentionally, don't reconnect
        return
      }
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnect()
        }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
      }
    })
  }

  private reconnect() {
    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    if (this.socket) {
      this.socket.connect()
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  // Event emission methods
  joinChatRoom(data: { roomId: string; projectId: string; applicationId?: string }): void {
    if (this.socket?.connected) {
      this.socket.emit('join_chat_room', data)
    } else {
      console.warn('Socket not connected, cannot join room', data)
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', roomId)
    }
  }

  sendMessage(data: SendMessageRequest): void {
    if (this.socket?.connected) {
      console.log('[SocketService] Sending message:', data)
      this.socket.emit('send_message', data)
    } else {
      console.warn('[SocketService] Socket not connected, cannot send message', data)
    }
  }

  getChatHistory(data: { roomId: string; projectId: string; applicationId?: string }): void {
    if (this.socket?.connected) {
      this.socket.emit('get_chat_history', data)
    }
  }

  startTyping(data: TypingEvent): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { ...data, isTyping: true })
    }
  }

  stopTyping(data: TypingEvent): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { ...data, isTyping: false })
    }
  }

  // Event listening methods
  onReceiveMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('receive_message', callback)
    }
  }

  onChatHistory(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('chat_history', callback)
    }
  }

  onJoinedRoom(callback: (roomId: string) => void): void {
    if (this.socket) {
      this.socket.on('joined_room', callback)
    }
  }

  onUserTyping(callback: (data: TypingEvent) => void): void {
    if (this.socket) {
      this.socket.on('user_typing', callback)
    }
  }

  onError(callback: (error: any) => void): void {
    if (this.socket) {
      this.socket.on('error', callback)
    }
  }

  onUserJoined(callback: (userId: string) => void): void {
    if (this.socket) {
      this.socket.on('user_joined', callback)
    }
  }

  onUserLeft(callback: (userId: string) => void): void {
    if (this.socket) {
      this.socket.on('user_left', callback)
    }
  }

  // Remove event listeners
  offReceiveMessage(): void {
    if (this.socket) {
      this.socket.off('receive_message')
    }
  }

  offChatHistory(): void {
    if (this.socket) {
      this.socket.off('chat_history')
    }
  }

  offJoinedRoom(): void {
    if (this.socket) {
      this.socket.off('joined_room')
    }
  }

  offUserTyping(): void {
    if (this.socket) {
      this.socket.off('user_typing')
    }
  }

  offError(): void {
    if (this.socket) {
      this.socket.off('error')
    }
  }

  offUserJoined(): void {
    if (this.socket) {
      this.socket.off('user_joined')
    }
  }

  offUserLeft(): void {
    if (this.socket) {
      this.socket.off('user_left')
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }

  updateToken(token: string): void {
    this.token = token
    if (this.socket?.connected) {
      // Reconnect with new token
      this.disconnect()
      this.connect(token)
    }
  }
}

// Create singleton instance
const socketService = new SocketService()
export default socketService 