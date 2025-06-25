import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export default function ProjectsPage() {
  // Sample project data
  const projects = [
    {
      id: 1,
      title: "AI-Powered Health Tracking App",
      description:
        "Looking for developers and designers to build a health tracking app that uses AI to provide personalized recommendations.",
      founder: "Alex Johnson",
      founderRating: "4.8",
      skills: ["React Native", "AI/ML", "UI/UX Design"],
      type: "Startup",
      timeline: "3-6 months",
    },
    {
      id: 2,
      title: "E-commerce Platform for Local Artisans",
      description:
        "Building a marketplace to connect local artisans with customers. Need full-stack developers and a product manager.",
      founder: "Sarah Chen",
      founderRating: "4.5",
      skills: ["React", "Node.js", "Product Management"],
      type: "Startup",
      timeline: "2-4 months",
    },
    {
      id: 3,
      title: "Open-Source Code Editor Extensions",
      description:
        "Creating a suite of productivity extensions for popular code editors. Looking for JavaScript developers.",
      founder: "Michael Rodriguez",
      founderRating: "4.9",
      skills: ["JavaScript", "VS Code API", "Extension Development"],
      type: "Open Source",
      timeline: "Ongoing",
    },
    {
      id: 4,
      title: "Environmental Impact Tracking Dashboard",
      description:
        "Developing a dashboard to help businesses track and reduce their environmental impact. Need frontend developers and data visualization experts.",
      founder: "Emily Taylor",
      founderRating: "4.7",
      skills: ["React", "D3.js", "Data Visualization"],
      type: "Social Impact",
      timeline: "2-3 months",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Explore Projects</h1>
          <p className="text-muted-foreground">Find exciting projects that match your skills and interests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="my-6 flex w-full items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search projects by keyword, skill, or type..." className="w-full pl-8" />
        </div>
        <Button type="submit">Search</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
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
            <CardContent className="flex-1">
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
      </div>
    </div>
  )
}
