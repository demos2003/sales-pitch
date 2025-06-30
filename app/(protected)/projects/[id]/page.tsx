"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, Award, Briefcase, Star, MessageSquare, Edit, UserPlus } from "lucide-react"
// import { useAuth } from "@/context/auth-context"
import {  useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function ProjectPage({ params }: { params: { id: string } }) {


    const [user, setUser] = useState<any>(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    const isFounder = user?.role === "founder";

  const [hasApplied, setHasApplied] = useState(false)

  // This would normally be fetched from an API based on the ID
  const project = {
    id: params.id,
    title: "AI-Powered Health Tracking App",
    description:
      "We're building a revolutionary health tracking app that uses artificial intelligence to provide personalized recommendations to users. The app will track various health metrics, analyze patterns, and offer actionable insights to improve overall wellbeing.",
    longDescription:
      "Our vision is to create a health companion that goes beyond simple tracking. By leveraging machine learning algorithms, we'll analyze user data to identify patterns and provide truly personalized recommendations. The app will include features like meal planning based on nutritional needs, workout suggestions tailored to fitness goals, and sleep optimization strategies.\n\nWe've already completed market research and created wireframes. Now we need a talented team to bring this vision to life.",
    founder: {
      name: "Alex Johnson",
      avatar: "AJ",
      title: "Healthcare Technologist",
      rating: "4.8",
      completedProjects: 3,
    },
    skills: ["React Native", "AI/ML", "UI/UX Design", "Backend Development", "Health Data Analytics"],
    type: "Startup",
    timeline: "3-6 months",
    team: {
      required: [
        { role: "React Native Developer", filled: false },
        { role: "UI/UX Designer", filled: false },
        { role: "Machine Learning Engineer", filled: true },
        { role: "Backend Developer", filled: false },
      ],
      size: "4-5 members",
    },
    equity: "Potential equity for key team members",
    updates: [
      { date: "2023-05-15", content: "Project created" },
      { date: "2023-05-20", content: "Added detailed requirements document" },
      { date: "2023-05-25", content: "First team member joined - Welcome Sarah (ML Engineer)!" },
    ],
  }

  const handleApply = () => {
    setHasApplied(true)
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the project founder.",
    })
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  ← Back to Projects
                </Button>
              </Link>
              <Badge variant="outline">{project.type}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{project.founder.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.founder.name}</p>
                <p className="text-sm text-muted-foreground">{project.founder.title}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              {isFounder && <TabsTrigger value="applications">Applications</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{project.longDescription}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Composition</CardTitle>
                  <CardDescription>Looking for a team of {project.team.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.team.required.map((position, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>{position.role}</span>
                        </div>
                        <Badge variant={position.filled ? "success" : "outline"}>
                          {position.filled ? "Filled" : "Open"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compensation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>{project.equity}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Updates</CardTitle>
                  {isFounder && (
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Add Update
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.updates.map((update, index) => (
                      <li key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{update.date}</p>
                          <p>{update.content}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {isFounder && (
              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Applications (3)</CardTitle>
                    <CardDescription>Review and manage applications to your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-4 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Sarah Chen</p>
                            <p className="text-sm text-muted-foreground">UI/UX Designer • DS: 4.9</p>
                          </div>
                          <Badge>New</Badge>
                        </div>
                        <p className="text-sm mt-2">
                          I have 3 years of experience designing health apps and would love to contribute to this
                          project.
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-muted-foreground">React Native Developer • DS: 4.7</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          I've built several mobile apps with React Native and have experience with health data APIs.
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Rachel Kim</p>
                            <p className="text-sm text-muted-foreground">Backend Developer • DS: 4.8</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          I specialize in building secure and scalable APIs for health applications.
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          {isFounder ? (
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
                <Button variant="outline" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Contributors
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Apply to Join</CardTitle>
                <CardDescription>Express your interest in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasApplied ? (
                  <div className="text-center py-2">
                    <Badge variant="outline" className="mb-2">
                      Application Submitted
                    </Badge>
                    <p className="text-sm text-muted-foreground">The project founder will review your application.</p>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleApply}>
                    Apply Now
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Founder
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Timeline</span>
                </div>
                <span>{project.timeline}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Team Size</span>
                </div>
                <span>{project.team.size}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Founder Rating</span>
                </div>
                <span>PCA: {project.founder.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Completed Projects</span>
                </div>
                <span>{project.founder.completedProjects}</span>
              </div>
            </CardContent>
          </Card>

          {!isFounder && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/projects/2" className="block">
                  <div className="rounded-lg border p-3 hover:bg-muted/50">
                    <h3 className="font-medium">Fitness Tracking Wearable</h3>
                    <p className="text-sm text-muted-foreground">Looking for hardware and software engineers</p>
                  </div>
                </Link>
                <Link href="/projects/3" className="block">
                  <div className="rounded-lg border p-3 hover:bg-muted/50">
                    <h3 className="font-medium">Mental Wellness App</h3>
                    <p className="text-sm text-muted-foreground">Need UI/UX designers and React Native developers</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
