"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Clock, Award, Briefcase, Star, MessageSquare, Edit, Trash2, Loader2 } from "lucide-react"
import { useGetProjectByIdQuery } from "@/api/features/projects/projectsSlice"
import { use, useEffect, useState } from "react"
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
import { getStoredUser } from "@/api/features/auth/authSlice"

const formatString = (str: string) => {
  return str?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsClient(true)
  }, []);

  const isFounder = user?.role === "founder";
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useGetProjectByIdQuery(id);
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
              <Badge variant="outline" className="text-xs">Project Type: {formatString(project.type)}</Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight">{project.title}</h1>
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">{project.founder.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{project.founder.name}</p>
                <p className="text-xs text-muted-foreground">Founder</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              {isClient && isFounder && <TabsTrigger value="applications">Applications</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Project Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm whitespace-pre-line text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Skills</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {project.skillSummary.split(",").map((skill: any, index: any) => (
                      <Badge key={index} variant="secondary" className="text-xs font-normal">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Team Composition</CardTitle>
                  <CardDescription className="text-xs">Looking for a team of {totalTeamSize}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {project.rolesNeeded?.map((role: any, index: any) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{role.skill}</span>
                        </div>
                        <Badge variant="outline" className="text-xs font-normal">
                          {role.count} Open
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Compensation</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {project.compensation?.map((item: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs font-normal">
                        {formatString(item)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="updates" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Project Updates</CardTitle>
                  {isClient && isFounder && (
                    <Button size="sm" variant="outline">
                      <Edit className="mr-2 h-3.5 w-3.5" />
                      Add Update
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {project.updates && project.updates.length > 0 ? (
                    <ul className="space-y-3">
                      {project.updates?.map((update: any, index: any) => (
                        <li key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">{new Date(update.date).toLocaleDateString()}</p>
                            <p className="mt-0.5">{update.content}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-6">
                      <p>No updates available yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isClient && isFounder && (
              <TabsContent value="applications" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Applications (3)</CardTitle>
                    <CardDescription className="text-xs">Review and manage applications to your project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-start space-x-3 pb-3 border-b text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">SC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">Sarah Chen</p>
                            <p className="text-xs text-muted-foreground">UI/UX Designer • DS: 4.9</p>
                          </div>
                          <Badge className="text-xs shrink-0">New</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          I have 3 years of experience designing health apps and would love to contribute to this
                          project.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 pb-3 border-b text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">John Doe</p>
                            <p className="text-xs text-muted-foreground">React Native Developer • DS: 4.7</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          I've built several mobile apps with React Native and have experience with health data APIs.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm">Accept</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">RK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">Rachel Kim</p>
                            <p className="text-xs text-muted-foreground">Backend Developer • DS: 4.8</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          I specialize in building secure and scalable APIs for health applications.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline">View Profile</Button>
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

        <div className="space-y-4">
          {isClient ? (
            isFounder ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Project Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <Link href={`/projects/${id}/edit`} className="w-full">
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Apply to Join</CardTitle>
                  <CardDescription className="text-xs">Express your interest in this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {isCheckingStatus ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : applicationStatus?.hasApplied === true ? (
                    <div className="text-center py-2">
                      <Badge variant="outline" className="mb-2 text-xs">
                        Application Status: {formatString(applicationStatus.application.status)}
                      </Badge>
                      {applicationStatus.message && (
                        <p className="text-xs text-muted-foreground">{applicationStatus.message}</p>
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
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Apply to Join</CardTitle>
                <CardDescription className="text-xs">Express your interest in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration</span>
                </div>
                <span>{formatString(project.timeline)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Team Size</span>
                </div>
                <span>{totalTeamSize}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Founder Rating</span>
                </div>
                <span>PCA: 5.0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Time Commitment</span>
                </div>
                <span>{formatString(project.timeCommitment)}</span>
              </div>
            </CardContent>
          </Card>

          {isClient && !isFounder && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Similar Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Link href="/projects/2" className="block">
                  <div className="rounded-lg border p-2.5 hover:bg-muted/50 text-sm">
                    <h3 className="font-medium text-sm">Fitness Tracking Wearable</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Looking for hardware and software engineers</p>
                  </div>
                </Link>
                <Link href="/projects/3" className="block">
                  <div className="rounded-lg border p-2.5 hover:bg-muted/50 text-sm">
                    <h3 className="font-medium text-sm">Mental Wellness App</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Need UI/UX designers and React Native developers</p>
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
