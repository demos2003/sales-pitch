'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Loader2, PlusCircle } from "lucide-react"
import { useGetAllProjectsQuery, setSelectedProject } from "@/api/features/projects/projectsSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/api/store"


export default function ProjectsPage() {

  const dispatch = useDispatch();
  const { data: projects = [], isLoading, isError } = useGetAllProjectsQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const isFounder = user?.role === "founder";

  const handleViewProject = (project: any) => {
    dispatch(setSelectedProject(project));
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Explore Projects</h1>
          <p className="text-muted-foreground">Find exciting projects that match your skills and interests</p>
        </div>
        <div className="flex items-center space-x-2">
          {isFounder && (
            <Link href="/create-project">
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          )}
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

   {isLoading ? (
        <div className="flex h-[40vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <p className="text-red-500">Failed to load projects.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Card key={project._id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge variant="outline">{project.type}</Badge>
                </div>
                <CardDescription>
                  <div className="flex items-center space-x-1">
                    <span>By {project.founder.name}</span>
                    <span>•</span>
                    <span>PCA: 5.0</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{project.description}</p>
                <div className="mt-4">
                  <p className="text-sm font-medium">Skills needed:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.skillSummary.split(',').map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
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
                <Link href={`/projects/${project._id}`} className="w-full" onClick={() => handleViewProject(project)}>
                  <Button className="w-full">View Project</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </div>
  )
}

