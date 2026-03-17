"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, PlusCircle, CheckCircle, Clock, Users, Search, Folder, FileText, BarChart } from "lucide-react"
import { Input } from "@/components/ui/input"
// import { useAuth } from "@/context/auth-context"
import { FirstLoginModal } from "@/components/first-login-modal"
import { 
  useGetNotificationsQuery, 
  useGetDashboardStatsQuery,
  type DashboardStats 
} from "@/api/features/notifications/notificationsSlice"
import { useCheckSkillsQuery } from "@/api/features/profile/profileSlice"
import { useGetAllProjectsQuery } from "@/api/features/projects/projectsSlice"
import { getStoredUser } from "@/api/features/auth/authSlice"

export default function DashboardPage() {


  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const name = user?.name;



  const isFounder = user?.role === "founder";
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false)
  
  // Mock metrics data - in a real app, this would come from an API
  type FounderMetrics = {
    activeProjects: number;
    applications: number;
    messages: number;
    pca: number;
  };

  type DeveloperMetrics = {
    activeProjects: number;
    applications: number;
    messages: number;
    ds: number;
  };

  // Use the API to fetch dashboard stats
  const { data: dashboardStats, isLoading, error } = useGetDashboardStatsQuery();
  
  // Initialize metrics with loading state
  const [metrics, setMetrics] = useState<FounderMetrics | DeveloperMetrics>({
    activeProjects: 0,
    applications: 0,
    messages: 0,
    ...(isFounder ? { pca: 0 } : { ds: 0 })
  });

  // Update metrics when dashboard stats are loaded
  useEffect(() => {
    if (dashboardStats) {
      setMetrics({
        activeProjects: dashboardStats.activeProjects || 0,
        applications: dashboardStats.applications || 0,
        messages: dashboardStats.messages || 0,
        ...(isFounder 
          ? { pca: dashboardStats.pca || 0 }
          : { ds: dashboardStats.ds || 0 }
        )
      });
    }
  }, [dashboardStats, isFounder]);

  // Use RTK Query to fetch notifications
  const { data: notificationsData = [], isLoading: isLoadingNotifications, error: notificationsError } = useGetNotificationsQuery()
  const notifications = notificationsData || []

  // Format notification time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
  }

  // Use the profile slice to check if we need to show the skills modal
  const { data: skillsData, isLoading: isLoadingSkills } = useCheckSkillsQuery(undefined, {
    skip: !user || user?.role !== "contributor"
  });

  useEffect(() => {
    if (skillsData?.isEmpty && user?.role === "contributor") {
      setShowFirstLoginModal(true);
    }
  }, [skillsData, user?.role]);

  const handleOnboardingComplete = () => {
    setShowFirstLoginModal(false);
  }

  // Fetch projects from the API
  const { data: projects = [], isLoading: isLoadingProjects } = useGetAllProjectsQuery()

  // Transform projects to match the expected format
  const userProjects = projects.map(project => ({
    ...project,
    id: project._id || project.id,
    title: project.title,
    role: project.role || (isFounder ? "Founder" : "Contributor"),
    status: project.status || "In Progress",
    team: project.teamSize || 1,
    updates: project.updates || 0,
    messages: project.messages || 0,
    description: project.description || "",
  }))

  const tasks = [
    {
      id: 1,
      title: isFounder ? "Review project applications" : "Complete project wireframes",
      project: "AI-Powered Health Tracking App",
      dueDate: "May 25, 2023",
      status: "In Progress",
    },
    {
      id: 2,
      title: isFounder ? "Update project requirements" : "Implement user authentication",
      project: "AI-Powered Health Tracking App",
      dueDate: "May 22, 2023",
      status: "Completed",
    },
    {
      id: 3,
      title: isFounder ? "Prepare project presentation" : "Create responsive design",
      project: "AI-Powered Health Tracking App",
      dueDate: "May 30, 2023",
      status: "Not Started",
    },
  ]

  // Sample project data for the Explore section
  const exploreProjects = [
    {
      id: 3,
      title: "Environmental Impact Tracking Dashboard",
      description:
        "Developing a dashboard to help businesses track and reduce their environmental impact. Need frontend developers and data visualization experts.",
      founder: "Emily Taylor",
      founderRating: "4.7",
      skills: ["React", "D3.js", "Data Visualization"],
      type: "Social Impact",
      timeline: "2-3 months",
    },
    {
      id: 4,
      title: "Open-Source Code Editor Extensions",
      description:
        "Creating a suite of productivity extensions for popular code editors. Looking for JavaScript developers.",
      founder: "Michael Rodriguez",
      founderRating: "4.9",
      skills: ["JavaScript", "VS Code API", "Extension Development"],
      type: "Open Source",
      timeline: "Ongoing",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-[20px]">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {name}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isFounder && (
            <Link href="/create-project">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          )}
          {!isFounder && (
            <Link href="/projects">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Find Projects
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFounder ? 'Applications' : 'My Applications'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.applications}</div>
            <p className="text-xs text-muted-foreground">
              {isFounder ? 'New applications' : 'Submitted'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.messages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isFounder ? 'PCA' : 'DS'}
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isFounder ? (metrics as FounderMetrics).pca : (metrics as DeveloperMetrics).ds}
            </div>
            <p className="text-xs text-muted-foreground">
              {isFounder ? 'Project Completion Assessment' : 'Developer Score'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">{isFounder ? "My Projects" : "My Applications"}</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              {!isFounder && <TabsTrigger value="explore">Explore Projects</TabsTrigger>}
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {isLoadingProjects ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No projects found. {isFounder ? 'Create your first project to get started.' : 'Apply to projects to see them here.'}
                </div>
              ) : (
                userProjects.slice(0, 2).map((project: any) => (
                  <Card key={project._id || project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="mt-2">Role: {project.role}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4 text-sm">
                    <p>{project.description}</p>
                      {project.role === "Founder" && (
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{project.team}</span>
                        </div>
                      )}
                      {project.updates > 0 && (
                        <div className="flex items-center">
                          <Bell className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{project.updates} updates</span>
                        </div>
                      )}
                      {project.messages > 0 && (
                        <div className="flex items-center">
                          <MessageSquare className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{project.messages} messages</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/projects/${project._id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                  </Card>
                ))
              )}
              <div className="text-center">
                <div className="mt-2">
                  <Link href="/projects">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View All Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "default"
                            : task.status === "In Progress"
                              ? "default"
                              : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <CardDescription>{task.project}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </CardContent>
                  {task.status !== "Completed" && (
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        {task.status === "In Progress" ? "Mark Complete" : "Start Task"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </TabsContent>
            {!isFounder && (
              <TabsContent value="explore" className="space-y-4">
                <div className="flex w-full items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search projects by keyword, skill, or type..."
                      className="w-full pl-8"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </div>

                {exploreProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">{project.title}</CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0">{project.type}</Badge>
                      </div>
                      <CardDescription className="text-xs mt-1">
                        <div className="flex items-center space-x-1">
                          <span>By {project.founder}</span>
                          <span>•</span>
                          <span>PCA: {project.founderRating}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground">Skills needed:</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {project.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs font-normal">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Timeline:</span> {project.timeline}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href={`/projects/${project.id}`} className="w-full">
                        <Button className="w-full" size="sm">View Project</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}

                <div className="text-center">
                  <Link href="/projects">
                    <Button variant="link">View All Projects</Button>
                  </Link>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : notificationsError ? (
                <div className="text-center py-4 text-sm text-destructive">
                  {notificationsError?.toString() || 'An error occurred'}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No notifications yet</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-center justify-center py-[10px] space-x-3 border-b last:border-0 ${!notification.isRead ? 'bg-muted/30 p-2 rounded-md' : ''
                      }`}
                  >

                    <div className="mt-0.5">
                      {notification.type === "application_received" && (
                        <Users className="h-5 w-5 text-blue-500" />
                      )}
                      {notification.type === "message" && (
                        <MessageSquare className="h-5 w-5 text-green-500" />
                      )}
                      {notification.type === "update" && (
                        <Bell className="h-5 w-5 text-yellow-500" />
                      )}
                      {!notification.type && (
                        <Bell className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      {notification.projectId && (
                        <p className="text-xs text-muted-foreground">
                          Project: {notification.projectId.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {notifications.length > 0 && (
              <CardFooter>
                <Button variant="link" className="w-full">
                  View All Notifications
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      {/* Add the FirstLoginModal at the end */}
      <FirstLoginModal isOpen={showFirstLoginModal} onComplete={handleOnboardingComplete} />
    </div>
  )
}
