"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import {
  Send,
  Paperclip,
  Smile,
  BarChart3,
  Users,
  Settings,
  Hash,
  Plus,
  FileText,
  ImageIcon,
  Video,
  Download,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Reply,
  Edit3,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGetGroupChatsQuery, useUploadFileMutation, useCreatePollMutation, useVotePollMutation } from "@/api/features/chat/chatApiSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChat } from "@/context/chat-context"
import { cn } from "@/lib/utils"
import { WorkspaceSchedule } from "@/components/workspace-schedule"
import { WorkspaceUpcomingSchedule } from "@/components/workspace-upcoming-schedule"

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  status: "online" | "away" | "offline"
  isFounder?: boolean
}

interface Project {
  id: string
  name: string
  type: "active" | "completed" | "archived"
  unread: number
  isPrivate?: boolean
}

interface TeamChatInterfaceProps {
  projectId: string
  projectTitle: string
  isFounder: boolean
}

export function Workspace({ projectId, projectTitle, isFounder }: TeamChatInterfaceProps) {
  const [selectedChannel, setSelectedChannel] = useState("project1")
  const [workspaceTab, setWorkspaceTab] = useState<"chat" | "schedule">("chat")
  const [newMessage, setNewMessage] = useState("")
  const [showPollDialog, setShowPollDialog] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [pollAllowMultiple, setPollAllowMultiple] = useState(false)
  const [pollIsAnonymous, setPollIsAnonymous] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state, joinRoom, sendMessage: sendSocketMessage } = useChat()
  const [uploadFile] = useUploadFileMutation()
  const [createPoll, { isLoading: isCreatingPoll }] = useCreatePollMutation()
  const [votePoll] = useVotePollMutation()

  // Fetch group chats and log the response
  const { data: groupChats, isLoading: isLoadingGroupChats, isError: isGroupChatsError, error: groupChatsError } = useGetGroupChatsQuery()

  useEffect(() => {
    if (groupChats) {
      console.log("[Workspace] Group chats:", groupChats)
    }
    if (isGroupChatsError) {
      console.error("[Workspace] Failed to fetch group chats:", groupChatsError)
    }
  }, [groupChats, isGroupChatsError, groupChatsError])

  // Derive projects from API only (no dummy fallback)
  const projects: Project[] = groupChats?.map((g: any) => ({ id: g.projectId, name: g.projectTitle, type: "active", unread: 0 })) || []

  // Ensure selection defaults to first API project when loaded
  useEffect(() => {
    if (groupChats?.length) {
      const ids = groupChats.map((g: any) => g.projectId)
      if (!ids.includes(selectedChannel)) {
        setSelectedChannel(groupChats[0].projectId)
      }
    }
  }, [groupChats])

  // Build team members from selected group
  const selectedGroup = groupChats?.find((g: any) => g.projectId === selectedChannel)
  const teamMembers: TeamMember[] = selectedGroup
    ? selectedGroup.participants.map((p: any) => {
      const initials = p.name
        ? p.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
        : "U"
      return {
        id: p._id,
        name: p.name || p.email || "Unknown User",
        avatar: initials,
        role: p.primaryRole || p.role || "member",
        status: "online",
        isFounder: p.role === "founder",
      } as TeamMember
    })
    : []

  const selectedProjectName =
    selectedGroup?.projectTitle ??
    projects.find((p) => p.id === selectedChannel)?.name ??
    projectTitle ??
    "";

  // Join room when selected group changes
  useEffect(() => {
    if (selectedGroup?.roomId && selectedGroup?.projectId) {
      joinRoom(selectedGroup.roomId, selectedGroup.projectId)
    }
  }, [selectedGroup, joinRoom])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup?.projectId) return
    sendSocketMessage(newMessage, selectedGroup.projectId)
    setNewMessage("")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!state.currentRoom) {
      toast({ title: "No room joined", description: "Join a project chat first.", variant: "destructive" })
      return
    }
    try {
      await uploadFile({ roomId: state.currentRoom, file }).unwrap()
      toast({ title: "File uploaded", description: `${file.name} has been shared with the team.` })
    } catch (err: any) {
      toast({ title: "Upload failed", description: err?.data?.message || "Could not upload file", variant: "destructive" })
    }
  }

  const handleCreatePoll = async () => {
    if (!pollQuestion.trim() || pollOptions.filter((opt) => opt.trim()).length < 2) {
      toast({ title: "Invalid poll", description: "Please provide a question and at least 2 options.", variant: "destructive" })
      return
    }
    if (!state.currentRoom) {
      toast({ title: "No room joined", description: "Join a project chat first.", variant: "destructive" })
      return
    }
    try {
      await createPoll({
        roomId: state.currentRoom,
        question: pollQuestion.trim(),
        options: pollOptions.filter((o) => o.trim()),
        allowMultiple: pollAllowMultiple,
        isAnonymous: pollIsAnonymous,
      }).unwrap()
      setShowPollDialog(false)
      setPollQuestion("")
      setPollOptions(["", ""])
      setPollAllowMultiple(false)
      setPollIsAnonymous(false)
      toast({ title: "Poll created", description: "Your poll has been shared with the team." })
    } catch (err: any) {
      toast({ title: "Poll creation failed", description: err?.data?.message || "Could not create poll", variant: "destructive" })
    }
  }

  const handleReaction = (_messageId: string, _emoji: string) => {
    toast({ title: "Reactions coming soon", description: "This action isn't wired to backend yet." })
  }

  const handleVotePoll = async (_messageId: string, optionId: string) => {
    if (!state.currentRoom) return
    try {
      await votePoll({ roomId: state.currentRoom, optionId }).unwrap()
    } catch (err: any) {
      toast({ title: "Vote failed", description: err?.data?.message || "Could not register vote", variant: "destructive" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-[700px] w-full border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        {/* Project Header */}
        <div className="p-4 border-b">
          {isLoadingGroupChats ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          ) : (
            <>
              <h2 className="font-semibold truncate">{selectedProjectName || ""}</h2>
              <p className="text-sm text-muted-foreground">{teamMembers.length} members</p>
            </>
          )}
        </div>

        {/* Projects */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">PROJECTS</h3>
              {isFounder && (
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              {isLoadingGroupChats ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-full flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center space-x-2 w-full">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  </div>
                ))
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedChannel(project.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-muted/50 ${selectedChannel === project.id ? "bg-muted text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      <span>{project.name}</span>
                    </div>
                    {project.unread > 0 && (
                      <Badge variant="destructive" className="h-5 text-xs">
                        {project.unread}
                      </Badge>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground px-2 py-1.5">No projects found</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Team Members */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">TEAM MEMBERS</h3>
            <div className="space-y-2">
              {isLoadingGroupChats ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  </div>
                ))
              ) : teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder_24x24.png?key=5r69n&height=24&width=24&text=${member.avatar}`} />
                        <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm truncate">{member.name}</span>
                        {member.isFounder && (
                          <Badge variant="secondary" className="text-xs">
                            Founder
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No team members</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Chat + Schedule */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Chat / Schedule tabs */}
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            {isLoadingGroupChats ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <h3 className="font-medium truncate">{selectedProjectName || ""}</h3>
            )}
          </div>
          <Tabs value={workspaceTab} onValueChange={(v) => setWorkspaceTab(v as "chat" | "schedule")} className="w-auto">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {workspaceTab === "schedule" ? (
          selectedChannel && selectedProjectName ? (
          <WorkspaceSchedule
            projectId={selectedChannel}
            projectName={selectedProjectName}
          />
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-4">
              Select a project from the sidebar to view its schedule.
            </div>
          )
        ) : (
          <>
        {/* Upcoming schedule in chat */}
        {selectedChannel && (
          <WorkspaceUpcomingSchedule projectId={selectedChannel} maxItems={6} />
        )}
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
  <div className="space-y-4">
    {isLoadingGroupChats || state.isLoading ? (
      Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))
    ) : state.messages.length > 0 ? (
      state.messages.map((message) => (
        <div key={message._id} className="group">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/placeholder-6pkyk.png?height=32&width=32`} />
              <AvatarFallback>
                {(message?.senderId?.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">
                  {message?.senderId?.name || "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
                {/* {message.isPinned && <Pin className="h-3 w-3 text-muted-foreground" />} */}
              </div>

              <div className={cn("flex flex-col max-w-[70%]")}>
                <div className={cn("rounded-lg px-3 py-2 text-sm bg-muted w-fit")}>
                  {message.content && (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {/* File Attachment */}
                {/* {message.attachments && (
                  <div className="space-y-2">
                    <p className="text-sm">{message.content}</p>
                    {message.attachments.map((file) => (
                      <div key={file.id} className="flex items-center space-x-2 p-2 border rounded">
                        {getFileIcon(file.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )} */}


                {/* {message.poll && (
                  <div className="space-y-3 p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{message.poll.question}</span>
                    </div>
                    <div className="space-y-2">
                      {message.poll.options.map((option) => {
                        const totalVotes = message.poll.options.reduce(
                          (sum, opt) => sum + opt.votes.length,
                          0
                        );
                        const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                        const currentUserId = isFounder ? "founder1" : "user1";
                        const hasVoted = option.votes.includes(currentUserId);

                        return (
                          <div key={option.id} className="space-y-1">
                            <button
                              onClick={() => handleVotePoll(message._id, option.id)}
                              className={`w-full text-left p-2 rounded border hover:bg-muted/50 ${
                                hasVoted ? "border-primary bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{option.text}</span>
                                <span className="text-xs text-muted-foreground">
                                  {option.votes.length} {option.votes.length === 1 ? "vote" : "votes"}
                                </span>
                              </div>
                              <Progress value={percentage} className="h-1 mt-1" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {message.poll.allowMultiple ? "Multiple choices allowed" : "Single choice"} •{" "}
                      {message.poll.isAnonymous ? "Anonymous" : "Public"}
                    </p>
                  </div>
                )} */}
              </div>

              {/* Message Actions */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleReaction(message._id, "👍")}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Add reaction
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply in thread
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className="mr-2 h-4 w-4" />
                      Pin message
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-muted-foreground">No messages yet</p>
    )}
    <div ref={messagesEndRef} />
  </div>
</ScrollArea>
        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder={`Message #${selectedProjectName || ""}`}
                className="min-h-[60px] max-h-[120px] resize-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="*/*" />
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a Poll</DialogTitle>
                        <DialogDescription>Ask your team a question and get their input.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="poll-question">Question</Label>
                          <Input
                            id="poll-question"
                            placeholder="What should we work on next?"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {pollOptions.map((option, index) => (
                            <Input
                              key={index}
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...pollOptions]
                                newOptions[index] = e.target.value
                                setPollOptions(newOptions)
                              }}
                            />
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPollOptions([...pollOptions, ""])}
                            className="w-full"
                          >
                            + Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="multiple"
                              checked={pollAllowMultiple}
                              onCheckedChange={(v) => setPollAllowMultiple(!!v)}
                            />
                            <Label htmlFor="multiple">Allow multiple selections</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="anonymous" checked={pollIsAnonymous} onCheckedChange={(v) => setPollIsAnonymous(!!v)} />
                            <Label htmlFor="anonymous">Anonymous voting</Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPollDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePoll} disabled={isCreatingPoll}>
                          Create Poll
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !state.isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  )
}
