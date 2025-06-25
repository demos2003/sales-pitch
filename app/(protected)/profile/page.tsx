import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, GraduationCap, MapPin, LinkIcon, Github, Linkedin } from "lucide-react"

export default function ProfilePage() {
  
  // This would normally be fetched from an API based on the authenticated user
  const profile = {
    name: "Alex Johnson",
    title: "Founder & Healthcare Technologist",
    avatar: "AJ",
    location: "San Francisco, CA",
    bio: "Passionate about using technology to improve healthcare outcomes. I have 5+ years of experience in the healthcare tech industry and am currently working on an AI-powered health tracking app.",
    rating: "4.8",
    completedProjects: 3,
    skills: ["Product Management", "Healthcare", "AI/ML", "UX Research", "Business Strategy"],
    links: {
      website: "https://alexjohnson.com",
      github: "github.com/alexjohnson",
      linkedin: "linkedin.com/in/alexjohnson",
    },
    experience: [
      {
        title: "Product Manager",
        company: "HealthTech Inc.",
        period: "2020 - Present",
        description: "Leading product development for digital health solutions.",
      },
      {
        title: "UX Researcher",
        company: "MedApp",
        period: "2018 - 2020",
        description: "Conducted user research for medical applications.",
      },
    ],
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
    projects: [
      {
        id: 1,
        title: "AI-Powered Health Tracking App",
        role: "Founder",
        status: "In Progress",
        description: "A revolutionary health tracking app that uses AI to provide personalized recommendations.",
      },
      {
        id: 2,
        title: "Medical Appointment Scheduler",
        role: "Product Manager",
        status: "Completed",
        description: "A platform that streamlines the process of scheduling medical appointments.",
      },
      {
        id: 3,
        title: "Patient Data Analytics Dashboard",
        role: "UX Designer",
        status: "Completed",
        description: "A dashboard that helps healthcare providers analyze patient data.",
      },
    ],
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
                {profile.skills.map((skill, index) => (
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
              <Button variant="outline" className="w-full">
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
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4">
              {profile.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>Role: {project.role}</CardDescription>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
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
            </TabsContent>
            <TabsContent value="experience" className="space-y-4">
              {profile.experience.map((exp, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Briefcase className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <CardTitle>{exp.title}</CardTitle>
                        <CardDescription>
                          {exp.company} • {exp.period}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="education" className="space-y-4">
              {profile.education.map((edu, index) => (
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
    </div>
  )
}
