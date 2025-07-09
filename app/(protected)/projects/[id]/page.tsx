"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, Award, Briefcase, Star, MessageSquare, Edit, Trash2, Loader2 } from "lucide-react"
import { useGetProjectByIdQuery } from "@/api/features/projects/projectsSlice"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ApplyModal } from "@/components/apply-modal"
import { useApplyToProjectMutation, useCheckApplicationStatusQuery } from "@/api/features/application/applicationSlice"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteProjectMutation } from "@/api/features/projects/projectsSlice"
import { useRouter } from "next/navigation"

const formatString = (str: string) => {
  return str?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsClient(true)
  }, []);

  const isFounder = user?.role === "founder";
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useGetProjectByIdQuery(params.id as string);
  const [applyToProject, { isLoading, isSuccess, isError, reset }] = useApplyToProjectMutation();
  const { data: applicationStatus, isLoading: isCheckingStatus, error: checkStatusError } = useCheckApplicationStatusQuery(project?._id, {
    skip: !project?._id,
  });
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation();

  const router = useRouter();


  useEffect(() => {
    console.log(applicationStatus)
    if (applicationStatus?.hasApplied === true) {
      setHasApplied(true);
    }
  }, [applicationStatus]);

  const totalTeamSize = project?.rolesNeeded?.reduce((sum: number, role: any) => sum + role.count, 0);

  const handleApply = async (role: string, message: string) => {
    console.log("demilade Applies")
    if (!project?._id) {
      toast("Project ID is missing.");
      return;
    }
    try {
      await applyToProject({ projectId: project._id, role, message }).unwrap();
      toast("Application Submitted");
    } catch (error) {
      console.error("Failed to apply to project:", error);
      toast("Failed to submit application. Please try again.");
    }
  };

  const handleDeleteProject = async () => {
    if (!project?._id) {
      toast("Project ID is missing.");
      return;
    }
    try {
      await deleteProject(project._id).unwrap();
      toast("Project Deleted");
      router.push("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast("Failed to delete project. Please try again.");
    }
  };

  if (isProjectLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isProjectError) {
    return (
      <div className="container py-10 flex items-center justify-center text-red-500">
        Error loading project data.
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-10 flex items-center justify-center">
        Project not found.
      </div>
    );
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
              <Badge variant="outline">Project Type: {formatString(project.type)}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{project.founder.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.founder.name}</p>
                <p className="text-sm text-muted-foreground">Founder</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              {isClient && isFounder && <TabsTrigger value="applications">Applications</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-[25px]">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{project.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.skillSummary.split(",").map((skill: any, index: any) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Composition</CardTitle>
                  <CardDescription>Looking for a team of {totalTeamSize}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.rolesNeeded?.map((role: any, index: any) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <span>{role.skill}</span>
                        </div>
                        <Badge variant={"outline"}>
                          {role.count} Open
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
                  <div className="flex flex-wrap gap-2">
                    {project.compensation?.map((item: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {formatString(item)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="updates" className="space-y-6 mt-[25px]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Updates</CardTitle>
                  {isClient && isFounder && (
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Add Update
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {project.updates && project.updates.length > 0 ? (
                    <ul className="space-y-4">
                      {project.updates?.map((update: any, index: any) => (
                        <li key={index} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">{new Date(update.date).toLocaleDateString()}</p>
                            <p>{update.content}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No updates available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isClient && isFounder && (
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
          {isClient ? (
            isFounder ? (
              <Card>
                <CardHeader>
                  <CardTitle>Project Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href={`/projects/${params.id}/edit`} className="w-full">
                    <Button className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={isDeletingProject}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeletingProject ? "Deleting..." : "Delete Project"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your project
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Apply to Join</CardTitle>
                  <CardDescription>Express your interest in this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCheckingStatus ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : applicationStatus?.hasApplied === true ? (
                    <div className="text-center py-2">
                      <Badge variant="outline" className="mb-2">
                        Application Status: {formatString(applicationStatus.application.status)}
                      </Badge>
                      {applicationStatus.message && (
                        <p className="text-sm text-muted-foreground">{applicationStatus.message}</p>
                      )}
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setIsApplyModalOpen(true)}>
                      Apply Now
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Founder
                  </Button>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Apply to Join</CardTitle>
                <CardDescription>Express your interest in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" disabled>
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full" disabled>
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
                  <span className="text-muted-foreground">Duration</span>
                </div>
                <span>{formatString(project.timeline)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Team Size</span>
                </div>
                <span>{totalTeamSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Founder Rating</span>
                </div>
                <span>PCA: 5.0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Time Commitment</span>
                </div>
                <span>{formatString(project.timeCommitment)}</span>
              </div>
            </CardContent>
          </Card>

          {isClient && !isFounder && (
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
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSubmit={handleApply}
          rolesNeeded={project.rolesNeeded}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          reset={reset}
        />
      </div>
    </div>
  )
}
