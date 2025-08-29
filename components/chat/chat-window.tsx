'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, X, MessageCircle } from 'lucide-react'
import { useChat } from '@/context/chat-context'
import { Message } from '@/types/chat'
import { useSelector } from 'react-redux'
import { RootState } from '@/api/store'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  roomId: string
  projectId: string
  applicationId?: string
  onClose?: () => void
  className?: string
}

export function ChatWindow({ roomId, projectId, applicationId, onClose, className }: ChatWindowProps) {
  // console.log('[ChatWindow] Rendered with roomId:', roomId)
  const { state, sendMessage, startTyping, stopTyping, joinRoom, leaveRoom } = useChat()
  const user = useSelector((state: RootState) => state.auth.user)
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Join room when component mounts
  useEffect(() => {
    // console.log('[ChatWindow] useEffect - joining room:', roomId)
    if (roomId && projectId) {
      joinRoom(roomId, projectId)
    }

    return () => {
      // console.log('[ChatWindow] useEffect cleanup - leaving room:', roomId)
      if (roomId) {
        leaveRoom()
      }
    }
  }, [roomId, projectId, joinRoom, leaveRoom])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    // console.log('[ChatWindow] Messages updated:', state.messages)
    scrollToBottom()
  }, [state.messages, scrollToBottom])

  useEffect(() => {
    // console.log('[ChatWindow] Connection status:', state.isConnected)
  }, [state.isConnected])

  // Handle typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessageInput(value)

    // Start typing indicator
    if (!isTyping) {
      setIsTyping(true)
      startTyping()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing indicator after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      stopTyping()
    }, 2000)
  }

  // Handle message sending
  const handleSendMessage = () => {
    if (!messageInput.trim() || !state.isConnected) return
    console.log(messageInput)
    sendMessage(messageInput, projectId, applicationId)
    setMessageInput('')
    
    // Stop typing indicator
    setIsTyping(false)
    stopTyping()
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Check if message is from current user
  const isOwnMessage = (message: Message) => {
    console.log('Checking message ownership:')
    console.log('Message senderId:', message.senderId?._id)
    console.log('Current user ID:', user?._id)
    console.log('Is own message:', message.senderId?._id === user?._id)
    return message.senderId?._id === user?._id
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const messages = Array.isArray(state.messages) ? state.messages : [];

 

  return (
    <Card className={cn("w-full  h-[500px] flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Chat</CardTitle>
            
          </div>
          <div className="flex items-center space-x-2">
            {/* Connection status indicator */}
            <div className={cn(
              "w-2 h-2 rounded-full",
              state.isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : state.error ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-red-500 mb-2">Connection Error</p>
              <p>{state.error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <ScrollArea className="h-[350px] px-4" ref={scrollAreaRef}>
              <div className="space-y-4 pb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    console.log('Full message object:', message)
                    return (
                    <div
                      key={message._id}
                      className={cn(
                        "flex items-start space-x-2",
                        isOwnMessage(message) ? "flex-row-reverse space-x-reverse" : ""
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(message.senderId.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex flex-col max-w-[70%]",
                          isOwnMessage(message) ? "items-end" : "items-start"
                        )}
                      >
                        {
                          message.content ? (
                            <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            isOwnMessage(message)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message?.content} 
                        </div> 
                          ) : (
                            <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            isOwnMessage(message)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message?.message} 
                        </div> 
                          )
                        }
                     
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {message.senderId.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )})
                )}
                
                {/* Typing indicators */}
                {state.typingUsers.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">?</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!state.isConnected}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !state.isConnected}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!state.isConnected && (
                <p className="text-xs text-muted-foreground mt-2">
                  Connecting to chat server...
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 