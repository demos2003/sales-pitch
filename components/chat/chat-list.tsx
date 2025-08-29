'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, MessageCircle, Clock } from 'lucide-react'
import { useGetMyChatsQuery } from '@/api/features/chat/chatApiSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/api/store'

interface ChatListProps {
  className?: string
  onChatSelect?: (chat: any) => void
  selectedChatId?: string
}

export function ChatList({ className, onChatSelect, selectedChatId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const user = useSelector((state: RootState) => state.auth.user)
  
  const { data: chats = [], isLoading, error } = useGetMyChatsQuery()

  useEffect(() => {
    // console.log('[ChatList] Mounted. User:', user)
  }, [user])

  useEffect(() => {
    if (!isLoading && chats) {
      // console.log('[ChatList] Chats loaded:', chats)
    }
  }, [isLoading, chats])

  useEffect(() => {
    if (error) {
      // console.error('[ChatList] Error loading chats:', error)
    }
  }, [error])

  

  // Get the other person's name (not the current user)
  const getOtherPersonName = (chat: any) => {
    if (!chat.lastMessage || !user) return 'Unknown User'
    
    // If current user is the sender, show receiver's name
    if (chat.lastMessage.senderId?._id === user._id) {
      return chat.lastMessage.receiverId?.name || 'Unknown User'
    }
    // If current user is the receiver, show sender's name
    else {
      return chat.lastMessage.senderId?.name || 'Unknown User'
    }
  }

  // Filter chats based on search query
  const filteredChats = chats.filter((chat: any) => {
    console.log(chat)
    const searchLower = searchQuery.toLowerCase()
    const otherPersonName = getOtherPersonName(chat)
    return (
      chat.projectTitle?.toLowerCase().includes(searchLower) ||
      otherPersonName?.toLowerCase().includes(searchLower)
    )
  })

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleOpenChat = (chat: any) => {
    // console.log('[ChatList] Opening chat:', chat)
    if (onChatSelect) {
      onChatSelect(chat)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Failed to load conversations.</p>
            <Button variant="outline" size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
            <Badge variant="outline">{filteredChats.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Chat List */}
          <ScrollArea className="h-[400px]">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
                <p className="text-xs text-muted-foreground">
                  Start applying to projects to begin conversations with founders
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat: any) => (
                  <div
                    key={chat.roomId}
                    className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedChatId === chat.roomId ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleOpenChat(chat)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getUserInitials(getOtherPersonName(chat))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {getOtherPersonName(chat)}
                        </p>
                        {chat.lastMessage && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(new Date(chat.lastMessage.timestamp))}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.projectTitle || 'Unknown Project'}
                      </p>
                      {chat.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {chat.lastMessage.message}
                        </p>
                      )}
                    </div>
                    {/* Removed unread count since it's not in the API response */}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
    </Card>
  )
} 