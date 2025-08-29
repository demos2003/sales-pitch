'use client'

import { useState } from 'react'
import { ChatList } from '@/components/chat/chat-list'
import { ChatWindow } from '@/components/chat/chat-window'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Workspace } from '@/components/workspace'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null)

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat)
  }

  const handleChatClose = () => {
    setSelectedChat(null)
  }

  const isComingSoon = false;

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with project founders and team members
        </p>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ChatList onChatSelect={handleChatSelect} selectedChatId={selectedChat?.roomId} />
            </div>
            
            <div className="lg:col-span-2">
              {selectedChat ? (
                <ChatWindow
                  roomId={selectedChat.roomId}
                  projectId={selectedChat.lastMessage?.projectId?._id || selectedChat.lastMessage?.projectId}
                  onClose={handleChatClose}
                  
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="workspace" className="mt-6">
          <div className=" flex items-center justify-center ">
          {
            isComingSoon ? (
              <div className="text-center h-[600px]">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Workspace</h3>
              <p className="text-sm text-muted-foreground">
                Workspace functionality coming soon
              </p>
            </div>
            ) : (
                <Workspace/>
            )
          }
           
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}