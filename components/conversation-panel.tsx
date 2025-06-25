"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Send, CheckCircle, XCircle, FileText } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  read: boolean
}

interface Application {
  id: string
  applicantId?: string
  applicantName?: string
  applicantAvatar?: string
  applicantRole?: string
  applicantRating?: string
  founderId?: string
  founderName?: string
  founderAvatar?: string
  founderRole?: string
  founderRating?: string
  projectId: string
  projectTitle: string
  status: "pending" | "accepted" | "rejected"
  appliedDate: string
  interests: string[]
  skills: string[]
  reliability: number
  completedProjects: number
  hasResume: boolean
  education?: string
  experience?: string
  unreadMessages: number
}

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

interface ConversationPanelProps {
  conversationId: string | null
  isFounder: boolean
  applications: Application[]
  conversations: Conversation[]
}

export function ConversationPanel({ conversationId, isFounder, applications, conversations }: ConversationPanelProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Find the selected conversation
  const selectedConversation = conversations.find((conv) => conv.id === conversationId)

  // Find the related application (if any)
  const relatedApplication = applications.find(
    (app) =>
      (isFounder && app.applicantId === selectedConversation?.withUserId) ||
      (!isFounder && app.founderId === selectedConversation?.withUserId),
  )

  // Determine the other user's details
  const otherUser = selectedConversation
    ? {
        id: selectedConversation.withUserId,
        name: selectedConversation.withUserName,
        avatar: selectedConversation.withUserAvatar,
        role: selectedConversation.withUserRole,
      }
    : null

  const projectTitle = selectedConversation?.projectTitle || ""

  // Mock messages for the selected conversation
  useEffect(() => {
    if (conversationId) {
      // In a real app, you would fetch messages from an API
      const mockMessages: Message[] = [
        {
          id: "msg1",
          senderId: isFounder ? "founder1" : "user1",
          senderName: isFounder ? "Alex Johnson" : "Sarah Chen",
          senderAvatar: isFounder ? "AJ" : "SC",
          content: isFounder
            ? `Hi there! I'm interested in your application for the ${projectTitle} project.`
            : `Hi! I'm really excited about the ${projectTitle} project and would love to contribute.`,
          timestamp: "2023-05-20T10:30:00",
          read: true,
        },
        {
          id: "msg2",
          senderId: isFounder ? "user1" : "founder1",
          senderName: isFounder ? "Sarah Chen" : "Alex Johnson",
          senderAvatar: isFounder ? "SC" : "AJ",
          content: isFounder
            ? "Thanks for reaching out! I'm really excited about this project. I have experience with similar health apps."
            : "Thanks for your interest! Could you tell me more about your experience with similar projects?",
          timestamp: "2023-05-20T10:35:00",
          read: true,
        },
        {
          id: "msg3",
          senderId: isFounder ? "founder1" : "user1",
          senderName: isFounder ? "Alex Johnson" : "Sarah Chen",
          senderAvatar: isFounder ? "AJ" : "SC",
          content: isFounder
            ? "Great! Could you share some examples of your previous work?"
            : "I've worked on several health-related applications before. I can share my portfolio if you'd like.",
          timestamp: "2023-05-20T10:40:00",
          read: true,
        },
        {
          id: "msg4",
          senderId: isFounder ? "user1" : "founder1",
          senderName: isFounder ? "Sarah Chen" : "Alex Johnson",
          senderAvatar: isFounder ? "SC" : "AJ",
          content: isFounder
            ? "Of course! Here's a link to my portfolio: [portfolio link]. I've highlighted the health projects I've worked on."
            : "That would be great! I'd love to see your previous work.",
          timestamp: "2023-05-20T10:45:00",
          read: false,
        },
      ]

      setMessages(mockMessages)
    } else {
      setMessages([])
    }
  }, [conversationId, isFounder, projectTitle])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return

    // In a real app, you would send the message to an API
    const newMsg: Message = {
      id: `msg${messages.length + 1}`,
      senderId: isFounder ? "founder1" : "user1",
      senderName: isFounder ? "Alex Johnson" : "Sarah Chen",
      senderAvatar: isFounder ? "AJ" : "SC",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleAcceptApplication = () => {
    if (!relatedApplication) return

    // In a real app, you would call an API to update the application status
    toast({
      title: "Application Accepted",
      description: `You have accepted ${relatedApplication.applicantName}'s application.`,
    })
  }

  const handleRejectApplication = () => {
    if (!relatedApplication) return

    // In a real app, you would call an API to update the application status
    toast({
      title: "Application Rejected",
      description: `You have rejected ${relatedApplication.applicantName}'s application.`,
    })
  }

  if (!conversationId) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <CardContent className="text-center">
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${otherUser?.avatar}`} />
              <AvatarFallback>{otherUser?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherUser?.name}</CardTitle>
              <CardDescription>{otherUser?.role}</CardDescription>
            </div>
          </div>
          {isFounder && relatedApplication && relatedApplication.status === "pending" && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRejectApplication}>
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button size="sm" onClick={handleAcceptApplication}>
                <CheckCircle className="mr-1 h-4 w-4" />
                Accept
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
          <span>{projectTitle}</span>
          {relatedApplication && (
            <>
              <span>•</span>
              <Badge
                variant={
                  relatedApplication.status === "accepted"
                    ? "default"
                    : relatedApplication.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
                className="capitalize text-xs"
              >
                {relatedApplication.status}
              </Badge>
            </>
          )}
        </div>
      </CardHeader>

      {isFounder && relatedApplication && (
        <>
          <CardContent className="pb-0">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Applicant Details</h3>
                <span className="text-xs text-muted-foreground">
                  Applied {formatDistanceToNow(new Date(relatedApplication.appliedDate), { addSuffix: true })}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium">Reliability Score</p>
                  <p
                    className={`text-sm ${
                      relatedApplication.reliability >= 90
                        ? "text-green-600"
                        : relatedApplication.reliability >= 80
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {relatedApplication.reliability}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Completed Projects</p>
                  <p className="text-sm">{relatedApplication.completedProjects}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {relatedApplication.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              {relatedApplication.hasResume && (
                <div className="flex items-center mt-2">
                  <FileText className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">Resume available</span>
                </div>
              )}
            </div>
          </CardContent>
          <Separator />
        </>
      )}

      <CardContent className="flex-1 overflow-hidden pt-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage =
                (isFounder && message.senderId === "founder1") || (!isFounder && message.senderId === "user1")
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-2 max-w-[80%]">
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${message.senderAvatar}`} />
                        <AvatarFallback>{message.senderAvatar}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(message.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    {isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${message.senderAvatar}`} />
                        <AvatarFallback>{message.senderAvatar}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] max-h-[120px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
