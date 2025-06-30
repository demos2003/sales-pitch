"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, GraduationCap, MapPin, LinkIcon, Github, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"
import { WorkExperienceModal } from "@/components/work-experience-modal"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  

  // This would normally be fetched from an API based on the authenticated user
    const profile:any = {
    name: "Alex Johnson",
    title: "Founder & Healthcare Technologist", // This will determine if they're a founder
    avatar: "AJ",
    location: "San Francisco, CA",
    bio: "Passionate about using technology to improve healthcare outcomes. I have 5+ years of experience in the healthcare tech industry and am currently working on an AI-powered health tracking app.",
    rating: "4.8",
    completedProjects: 0, // Set to 0 to show empty state
    skills: ["Product Management", "Healthcare", "AI/ML", "UX Research", "Business Strategy"],
    links: {
      website: "https://alexjohnson.com",
      github: "github.com/alexjohnson",
      linkedin: "linkedin.com/in/alexjohnson",
    },
    experience: [], // Empty array to show empty state
    education: [
      {
        degree: "MBA",
        institution: "Stanford University",
        year: "2018",
      },
      {
        degree: "BS in Computer Science",
        institution: "UC Berkeley",
        year: "2016",
      },
    ],
    projects: [], // Empty array to show empty state
  }

  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<any>(null)
  const [workExperiences, setWorkExperiences] = useState([
    // You can add some sample data here or leave empty for empty state
  ])

  const handleAddExperience = () => {
    setEditingExperience(null)
    setShowExperienceModal(true)
  }

  const handleEditExperience = (experience: any) => {
    setEditingExperience(experience)
    setShowExperienceModal(true)
  }

  const handleSaveExperience = (experience: any) => {
    if (editingExperience) {
      // Update existing experience
      setWorkExperiences(workExperiences.map((exp) => (exp.id === experience.id ? experience : exp)))
    } else {
      // Add new experience
      setWorkExperiences([...workExperiences, experience])
    }
    setShowExperienceModal(false)
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">{profile.avatar}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription>{profile.title}</CardDescription>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{profile.rating}</div>
                  <div className="text-xs text-muted-foreground">PCA Rating</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{profile.completedProjects}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2">
              <Button variant="outline" size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill:any, index:any) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Message</Button>
              <Button variant="outline" className="w-full bg-transparent">
                View Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {profile.projects.length > 0 ? (
                profile.projects.map((project:any) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>Role: {project.role}</CardDescription>
                        </div>
                        <Badge variant={project.status === "In Progress" ? "default" : "outline"}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/projects/${project.id}`} className="w-full">
                        <Button variant="outline" className="w-full bg-transparent">
                          View Project
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      {user?.role === "founder" ? "No projects created yet" : "No projects joined yet"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      {user?.role === "founder"
                        ? "Start building your vision by creating your first project and finding talented contributors to join your team."
                        : "Discover exciting projects that match your skills and interests. Apply to projects and start building amazing products with passionate founders."}
                    </p>
                    <Link href={user?.role === "founder" ? "/create-project" : "/projects"}>
                      <Button>{user?.role === "founder" ? "Create Your First Project" : "Browse Projects"}</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="experience" className="space-y-4">
              {workExperiences.length > 0 ? (
                <>
                  {workExperiences.map((exp:any) => (
                    <Card key={exp.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Briefcase className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                              <CardTitle>{exp.jobTitle}</CardTitle>
                              <CardDescription>
                                {exp.company} • {exp.employmentType} • {exp.location}
                              </CardDescription>
                              <p className="text-sm text-muted-foreground mt-1">
                                {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEditExperience(exp)}>
                            Edit
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{exp.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={handleAddExperience} className="w-full bg-transparent">
                    + Add Another Position
                  </Button>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No work experience added</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Showcase your professional background by adding your work experience. This helps{" "}
                      {user?.role === "founder" ? "contributors" : "founders"} understand your expertise and
                      accomplishments.
                    </p>
                    <Button onClick={handleAddExperience}>Add Work Experience</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="education" className="space-y-4">
              {profile.education.map((edu:any, index:number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription>
                          {edu.institution} • {edu.year}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <WorkExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        onSave={handleSaveExperience}
        experience={editingExperience}
        mode={editingExperience ? "edit" : "add"}
      />
    </div>
  )
}