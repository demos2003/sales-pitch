"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  withUserId: string
  withUserName: string
  withUserAvatar: string
  withUserRole: string
  projectId: string
  projectTitle: string
  lastMessage: string
  lastMessageTime: string
  unread: number
}

interface MessagesListProps {
  conversations: Conversation[]
  onSelect: (id: string) => void
  selectedId: string | null
}

export function MessagesList({ conversations, onSelect, selectedId }: MessagesListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No messages found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedId === conversation.id ? "border-primary" : ""
          }`}
          onClick={() => onSelect(conversation.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${conversation.withUserAvatar}`} />
                <AvatarFallback>{conversation.withUserAvatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{conversation.withUserName}</div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{conversation.withUserRole}</div>
                <div className="text-sm truncate">{conversation.projectTitle}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</div>
                {conversation.unread > 0 && (
                  <div className="flex justify-end">
                    <Badge variant="default" className="text-xs">
                      {conversation.unread} new {conversation.unread === 1 ? "message" : "messages"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
