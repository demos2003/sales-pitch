"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useState } from "react"
// import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users } from "lucide-react"
import { ProjectApplicationsList } from "@/components/project-applications-list"
import { MessagesList } from "@/components/messages-list"
import { ConversationPanel } from "@/components/conversation-panel"
import { ApplicantProfile } from "@/components/applicant-profile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function MessagesPage() {
  // const { user } = useAuth()
  const isFounder = true;
  const [activeTab, setActiveTab] = useState("applications")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Mock data for founder's projects
  const founderProjects = [
    {
      id: "proj1",
      title: "AI-Powered Health Tracking App",
      description: "A revolutionary health tracking app that uses AI to provide personalized recommendations.",
      requiredRoles: [
        { role: "UI/UX Designer", count: 1, filled: 1 },
        { role: "React Native Developer", count: 2, filled: 1 },
        { role: "Backend Developer", count: 1, filled: 0 },
      ],
      applicantsCount: 3,
    },
    {
      id: "proj2",
      title: "E-commerce Platform for Local Artisans",
      description: "A marketplace to connect local artisans with customers worldwide.",
      requiredRoles: [
        { role: "Full Stack Developer", count: 2, filled: 0 },
        { role: "UI/UX Designer", count: 1, filled: 0 },
      ],
      applicantsCount: 1,
    },
  ]

  // Mock data for applications
  const applications = [
    {
      id: "app1",
      applicantId: "user1",
      applicantName: "Sarah Chen",
      applicantAvatar: "SC",
      applicantRole: "UI/UX Designer",
      applicantRating: "4.9",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      status: "accepted",
      appliedDate: "2023-05-20",
      interests: ["UI/UX Design", "Healthcare", "Mobile Apps", "Accessibility"],
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      reliability: 95,
      completedProjects: 7,
      hasResume: true,
      education: "BFA in Graphic Design, Rhode Island School of Design",
      experience: "5+ years in UI/UX design for healthcare applications",
      unreadMessages: 2,
    },
    {
      id: "app2",
      applicantId: "user2",
      applicantName: "John Doe",
      applicantAvatar: "JD",
      applicantRole: "React Native Developer",
      applicantRating: "4.7",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      status: "accepted",
      appliedDate: "2023-05-18",
      interests: ["Mobile Development", "Healthcare", "AI/ML", "React Native"],
      skills: ["React Native", "JavaScript", "TypeScript", "API Integration"],
      reliability: 88,
      completedProjects: 5,
      hasResume: true,
      education: "BS in Computer Science, MIT",
      experience: "3 years developing mobile applications with React Native",
      unreadMessages: 0,
    },
    {
      id: "app3",
      applicantId: "user3",
      applicantName: "Rachel Kim",
      applicantAvatar: "RK",
      applicantRole: "Backend Developer",
      applicantRating: "4.8",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      status: "pending",
      appliedDate: "2023-05-15",
      interests: ["Backend Development", "API Design", "Database Architecture", "Security"],
      skills: ["Node.js", "MongoDB", "API Design", "AWS"],
      reliability: 92,
      completedProjects: 8,
      hasResume: true,
      education: "MS in Computer Science, Stanford University",
      experience: "6 years building secure and scalable backend systems",
      unreadMessages: 0,
    },
    {
      id: "app4",
      applicantId: "user4",
      applicantName: "Michael Johnson",
      applicantAvatar: "MJ",
      applicantRole: "Full Stack Developer",
      applicantRating: "4.6",
      projectId: "proj2",
      projectTitle: "E-commerce Platform for Local Artisans",
      status: "pending",
      appliedDate: "2023-05-22",
      interests: ["E-commerce", "Full Stack Development", "Payment Integration", "UX"],
      skills: ["React", "Node.js", "MongoDB", "Stripe API"],
      reliability: 85,
      completedProjects: 4,
      hasResume: true,
      unreadMessages: 1,
    },
  ]

  // Mock data for tech creative applications (if user is a tech creative)
  const myApplications = [
    {
      id: "app5",
      founderId: "founder1",
      founderName: "Alex Johnson",
      founderAvatar: "AJ",
      founderRole: "Founder & Healthcare Technologist",
      founderRating: "4.8",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      status: "accepted",
      appliedDate: "2023-05-17",
      interests: ["Healthcare", "AI/ML", "Mobile Apps"],
      skills: ["React Native", "Mobile Development"],
      reliability: 90,
      completedProjects: 3,
      hasResume: true,
      unreadMessages: 3,
    },
    {
      id: "app6",
      founderId: "founder2",
      founderName: "Emily Taylor",
      founderAvatar: "ET",
      founderRole: "Founder & Environmental Advocate",
      founderRating: "4.7",
      projectId: "proj3",
      projectTitle: "Environmental Impact Tracking Dashboard",
      status: "pending",
      appliedDate: "2023-05-21",
      interests: ["Environment", "Data Visualization", "Sustainability"],
      skills: ["React", "D3.js", "Data Visualization"],
      reliability: 90,
      completedProjects: 3,
      hasResume: true,
      unreadMessages: 0,
    },
  ]

  // Mock data for messages/conversations
  const conversations = [
    {
      id: "conv1",
      withUserId: "user1",
      withUserName: "Sarah Chen",
      withUserAvatar: "SC",
      withUserRole: "UI/UX Designer",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      lastMessage: "I've uploaded the wireframes for the dashboard. Let me know what you think!",
      lastMessageTime: "2023-05-22T14:30:00",
      unread: 2,
    },
    {
      id: "conv2",
      withUserId: "user2",
      withUserName: "John Doe",
      withUserAvatar: "JD",
      withUserRole: "React Native Developer",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      lastMessage: "I've started working on the authentication flow. Should be done by tomorrow.",
      lastMessageTime: "2023-05-21T18:45:00",
      unread: 0,
    },
    {
      id: "conv3",
      withUserId: "founder1",
      withUserName: "Alex Johnson",
      withUserAvatar: "AJ",
      withUserRole: "Founder & Healthcare Technologist",
      projectId: "proj1",
      projectTitle: "AI-Powered Health Tracking App",
      lastMessage: "Great work on the login screen! Can you add biometric authentication as well?",
      lastMessageTime: "2023-05-22T09:15:00",
      unread: 3,
    },
  ]

  // Filter applications based on search query and filters
  const filteredApplications = (isFounder ? applications : myApplications).filter((app) => {
    const matchesSearch =
      app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isFounder ? app.applicantName : app.founderName).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesProject = selectedProject ? app.projectId === selectedProject : true

    return matchesSearch && matchesStatus && matchesProject
  })

  // Group applications by project
  const applicationsByProject = filteredApplications.reduce(
    (acc, app) => {
      if (!acc[app.projectId]) {
        acc[app.projectId] = {
          projectId: app.projectId,
          projectTitle: app.projectTitle,
          applications: [],
        }
      }
      acc[app.projectId].applications.push(app)
      return acc
    },
    {} as Record<string, { projectId: string; projectTitle: string; applications: typeof filteredApplications }>,
  )

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.withUserName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Find selected applicant
  const selectedApplicantData = applications.find((app) => app.id === selectedApplicant)

  // Find selected project
  const selectedProjectData = founderProjects.find((project) => project.id === selectedProject)

  // Calculate remaining slots for the selected project
  const getRemainingSlots = (project: (typeof founderProjects)[0]) => {
    const totalRequired = project.requiredRoles.reduce((sum, role) => sum + role.count, 0)
    const totalFilled = project.requiredRoles.reduce((sum, role) => sum + role.filled, 0)
    return totalRequired - totalFilled
  }

  // Get accepted applicants for a project
  const getAcceptedApplicants = (projectId: string) => {
    return applications.filter((app) => app.projectId === projectId && app.status === "accepted")
  }

  // Get pending applicants for a project
  const getPendingApplicants = (projectId: string) => {
    return applications.filter((app) => app.projectId === projectId && app.status === "pending")
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Messages & Applications</h1>
        <p className="text-muted-foreground">
          {isFounder
            ? "Manage project applications and communicate with potential team members"
            : "Track your applications and communicate with project founders"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Status</p>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="applications">
                Applications
                <Badge variant="secondary" className="ml-2">
                  {(isFounder ? applications : myApplications).filter((app) => app.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="messages">
                Messages
                <Badge variant="secondary" className="ml-2">
                  {conversations.reduce((count, conv) => count + conv.unread, 0)}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications" className="mt-4 space-y-4">
              {isFounder ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {founderProjects.map((project) => (
                      <Card
                        key={project.id}
                        className={`cursor-pointer hover:bg-muted/50 ${selectedProject === project.id ? "border-primary" : ""}`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <Badge variant="secondary">
                              {project.applicantsCount} {project.applicantsCount === 1 ? "Applicant" : "Applicants"}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="space-y-4">
                  {Object.values(applicationsByProject).map((projectGroup) => (
                    <div key={projectGroup.projectId}>
                      <h3 className="text-lg font-medium mb-2">{projectGroup.projectTitle}</h3>
                      <ProjectApplicationsList
                        applications={projectGroup.applications}
                        isFounder={false}
                        onSelect={(id) => {
                          setSelectedConversation(id)
                          setSelectedApplicant(null)
                          // On mobile, we might want to switch to the conversation panel
                          if (window.innerWidth < 1024) {
                            document.getElementById("conversation-panel")?.scrollIntoView({ behavior: "smooth" })
                          }
                        }}
                        selectedId={selectedConversation}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-4 space-y-4">
              <MessagesList
                conversations={filteredConversations}
                onSelect={(id) => {
                  setSelectedConversation(id)
                  setSelectedApplicant(null)
                  // On mobile, we might want to switch to the conversation panel
                  if (window.innerWidth < 1024) {
                    document.getElementById("conversation-panel")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                selectedId={selectedConversation}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div id="applicant-panel" className="lg:col-span-2">
          {selectedProject && isFounder ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedProjectData?.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedProjectData?.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-6">
                    {/* Team Composition Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Team Composition</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {selectedProjectData?.requiredRoles.map((role, index) => (
                          <Card key={index} className="p-3">
                            <div className="font-medium">{role.role}</div>
                            <div className="text-sm text-muted-foreground">
                              {role.filled}/{role.count} filled
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">Remaining Positions:</span>
                        </div>
                        <Badge variant={getRemainingSlots(selectedProjectData!) > 0 ? "outline" : "secondary"}>
                          {getRemainingSlots(selectedProjectData!)}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Accepted Applicants Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Accepted Team Members</h3>
                      {getAcceptedApplicants(selectedProject).length > 0 ? (
                        <div className="space-y-3">
                          {getAcceptedApplicants(selectedProject).map((applicant) => (
                            <Card key={applicant.id} className="p-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{applicant.applicantAvatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{applicant.applicantName}</div>
                                  <div className="text-sm text-muted-foreground">{applicant.applicantRole}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-auto"
                                  onClick={() => {
                                    // Find the conversation with this applicant
                                    const conversation = conversations.find(
                                      (c) => c.withUserId === applicant.applicantId,
                                    )
                                    if (conversation) {
                                      setSelectedConversation(conversation.id)
                                      setSelectedApplicant(null)
                                    }
                                  }}
                                >
                                  Message
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No team members accepted yet.</p>
                      )}
                    </div>

                    <Separator />

                    {/* Pending Applicants Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Pending Applications</h3>
                      {getPendingApplicants(selectedProject).length > 0 ? (
                        <div className="space-y-3">
                          <ProjectApplicationsList
                            applications={getPendingApplicants(selectedProject)}
                            onSelect={(id) => {
                              setSelectedApplicant(id)
                              setSelectedProject(null)
                            }}
                            selectedId={selectedApplicant}
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No pending applications.</p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : selectedApplicant && selectedApplicantData ? (
            <ApplicantProfile
              applicant={selectedApplicantData}
              onMessageClick={() => {
                // Find the conversation with this applicant
                const conversation = conversations.find((c) => c.withUserId === selectedApplicantData.applicantId)
                if (conversation) {
                  setSelectedConversation(conversation.id)
                  setSelectedApplicant(null)
                }
              }}
              onAccept={() => {
                // In a real app, you would call an API to update the application status
                toast({
                  title: "Application Accepted",
                  description: `You have accepted ${selectedApplicantData.applicantName}'s application.`,
                })
              }}
              onReject={() => {
                // In a real app, you would call an API to update the application status
                toast({
                  title: "Application Rejected",
                  description: `You have rejected ${selectedApplicantData.applicantName}'s application.`,
                })
              }}
            />
          ) : selectedConversation ? (
            <ConversationPanel
              conversationId={selectedConversation}
              isFounder={isFounder}
              applications={isFounder ? applications : myApplications}
              conversations={conversations}
            />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {isFounder
                    ? "Select a project to view applications or a conversation to start messaging"
                    : "Select a conversation to start messaging"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
