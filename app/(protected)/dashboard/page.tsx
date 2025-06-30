"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, PlusCircle, CheckCircle, Clock, Users, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
// import { useAuth } from "@/context/auth-context"
import { FirstLoginModal } from "@/components/first-login-modal"

export default function DashboardPage() {


  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const name = user?.name;



  const isFounder = user?.role === "founder";
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false)

  

  // Check if it's the first login (in a real app, this would be stored in the user profile)
  useEffect(() => {
    // Mock first-time login check
    const isFirstLogin = !localStorage.getItem("hasLoggedInBefore")

    if (isFirstLogin && user?.role === "contributor") {
      setShowFirstLoginModal(true)
    }
  }, [user])

  const handleOnboardingComplete = () => {
    setShowFirstLoginModal(false)
    localStorage.setItem("hasLoggedInBefore", "true")
  }

  // This would normally be fetched from an API based on the authenticated user
  const userProjects = [
    {
      id: 1,
      title: "AI-Powered Health Tracking App",
      role: isFounder ? "Founder" : "Developer",
      status: "In Progress",
      team: 3,
      updates: 2,
      messages: 5,
    },
    {
      id: 2,
      title: "E-commerce Platform for Local Artisans",
      role: isFounder ? "Founder" : "UI/UX Designer",
      status: isFounder ? "In Progress" : "Applied",
      updates: isFounder ? 1 : 0,
      messages: isFounder ? 3 : 0,
    },
  ]

  const notifications = [
    {
      id: 1,
      type: isFounder ? "application" : "update",
      content: isFounder
        ? "Sarah applied to join your project 'AI-Powered Health Tracking App'"
        : "Your application for 'AI-Powered Health Tracking App' was accepted",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "message",
      content: isFounder
        ? "New message from Michael regarding 'AI-Powered Health Tracking App'"
        : "New message from Alex regarding 'AI-Powered Health Tracking App'",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: isFounder ? "update" : "application",
      content: isFounder
        ? "Your project 'E-commerce Platform' has 2 new applicants"
        : "Your application for 'E-commerce Platform' is being reviewed",
      time: "1 day ago",
    },
  ]

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
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
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

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isFounder ? "Active Projects" : "Joined Projects"}</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isFounder ? "Applications" : "Applications Sent"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+50% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {isFounder ? "Product Completion Avg" : "Dependency Score"}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
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
              {userProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>Role: {project.role}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4 text-sm">
                      {project.role === "Founder" && (
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{project.team} team members</span>
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
                    <Link href={`/projects/${project.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Project
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
              <div className="text-center">
                {isFounder ? (
                  <Link href="/create-project">
                    <Button variant="link">Create New Project</Button>
                  </Link>
                ) : (
                  <Link href="/projects">
                    <Button variant="link">Find More Projects</Button>
                  </Link>
                )}
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
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center space-x-1">
                          <span>By {project.founder}</span>
                          <span>•</span>
                          <span>PCA: {project.founderRating}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Skills needed:</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm">
                          <span className="font-medium">Timeline:</span> {project.timeline}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/projects/${project.id}`} className="w-full">
                        <Button className="w-full">View Project</Button>
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
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    {notification.type === "application" && <Users className="h-5 w-5 text-muted-foreground" />}
                    {notification.type === "message" && <MessageSquare className="h-5 w-5 text-muted-foreground" />}
                    {notification.type === "update" && <Bell className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Add the FirstLoginModal at the end */}
      <FirstLoginModal isOpen={showFirstLoginModal} onComplete={handleOnboardingComplete} />
    </div>
  )
}
