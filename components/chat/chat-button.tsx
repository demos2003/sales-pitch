'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { ChatWindow } from './chat-window'
import { toast } from '@/components/ui/use-toast'
import { useGenerateRoomMutation } from '@/api/features/chat/chatApiSlice'

interface ChatButtonProps {
  projectId: string
  contributorId: string
  contributorName: string
  projectTitle: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export function ChatButton({ 
  projectId, 
  contributorId, 
  contributorName, 
  projectTitle,
  className,
  variant = 'outline',
  size = 'sm'
}: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [generateRoom, { isLoading: isGeneratingRoom }] = useGenerateRoomMutation()

  useEffect(() => {
    // console.log('[ChatButton] Mounted for:', { projectId, contributorId, contributorName })
  }, [projectId, contributorId, contributorName])

  const handleOpenChat = async () => {
    try {
      const data = await generateRoom({ projectId, contributorId }).unwrap()
      const newRoomId = data.roomId || (data.room && data.room.roomId)
      if (!newRoomId) throw new Error('No roomId returned from backend')
      setRoomId(newRoomId)
      setIsChatOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open chat. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    // console.log('[ChatButton] Chat window closed')
  }

  useEffect(() => {
    // console.log('[ChatButton] Render state:', { isChatOpen, roomId })
  }, [isChatOpen, roomId])

  return (
    <>
      <Button
        onClick={handleOpenChat}
        variant={variant}
        size={size}
        className={className}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Message {contributorName}
      </Button>

      {isChatOpen && roomId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative">
            <ChatWindow
              roomId={roomId}
              projectId={projectId}
              onClose={handleCloseChat}
              className="w-full max-w-md"
            />
          </div>
        </div>
      )}
    </>
  )
} 