"use client"

import { AvatarFallback } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users, Loader2 } from "lucide-react"
import { ProjectApplicationsList } from "@/components/project-applications-list"
import { ApplicantProfile } from "@/components/applicant-profile"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"
import { useGetMyApplicationsQuery, useGetApplicationsGroupedByProjectForFounderQuery, useCancelApplicationMutation } from "@/api/features/application/applicationSlice"
import { getStoredUser } from "@/api/features/auth/authSlice"

export default function ApplicationsPage() {
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
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)
  const [selectedUserApplication, setSelectedUserApplication] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const { data: myApplications, isLoading: isLoadingMyApplications, error: myApplicationsError } = useGetMyApplicationsQuery(undefined, { skip: isFounder });
  const { data: founderProjectsData, isLoading: isLoadingFounderProjects, error: founderProjectsError } = useGetApplicationsGroupedByProjectForFounderQuery(undefined, { skip: !isFounder });
  const [cancelApplication, { isLoading: isCancelling }] = useCancelApplicationMutation();

  const founderProjects = founderProjectsData || [];

  // Fixed filtering logic to match actual data structure
  const filteredApplications = myApplications?.filter((app: any) => {
    const matchesSearch = isFounder
      ? (app.applicant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      : (app.project?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant?.name?.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesProject = selectedProject ? app.project?._id === selectedProject : true

    return matchesSearch && matchesStatus && matchesProject
  }) || []

  // Fixed: Get the selected applicant data correctly
  const selectedApplicantData = selectedProject && selectedApplicant
    ? founderProjects
      .find((p: any) => p.project._id === selectedProject)
      ?.applications.find((app: any) => app._id === selectedApplicant)
    : null

  const selectedProjectData = founderProjects.find(
    (item: any) => item.project._id === selectedProject
  )

  // Get accepted applicants for a project
  const getAcceptedApplicants = () => {
    if (!selectedProjectData || !selectedProjectData.applications) return []
    return selectedProjectData.applications.filter((app: any) => app.status === "accepted")
  }

  const getPendingApplicants = () => {
    if (!selectedProjectData || !selectedProjectData.applications) return []
    return selectedProjectData.applications.filter((app: any) => app.status === "pending")
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
    setSelectedApplicant(null)
  }

  const handleBackToApplications = () => {
    setSelectedUserApplication(null)
  }

  const handleBackToApplicationsList = () => {
    setSelectedApplicant(null)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">
          {isFounder
            ? "Manage project applications and review potential team members"
            : "Track your applications and view application details"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
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

          {/* Back button when viewing applicant profile */}
          {selectedApplicant && (
            <Button
              variant="outline"
              onClick={handleBackToApplicationsList}
              className="w-full"
            >
              ← Back to Applications
            </Button>
          )}

          {/* Back button when viewing project applications */}
          {selectedProject && !selectedApplicant && (
            <Button
              variant="outline"
              onClick={handleBackToProjects}
              className="w-full"
            >
              ← Back to Projects
            </Button>
          )}

          {/* Back button when viewing application details */}
          {selectedUserApplication && (
            <Button
              variant="outline"
              onClick={handleBackToApplications}
              className="w-full"
            >
              ← Back to Applications
            </Button>
          )}

          {/* List Content */}
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {isClient && isFounder ? (
                isLoadingFounderProjects ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : founderProjectsError ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Error loading your projects.</p>
                  </div>
                ) : selectedProject ? (
                  getPendingApplicants().length > 0 ? (
                    <div className="space-y-3">
                      {getPendingApplicants().map((application: any) => (
                        <Card
                          key={application._id}
                          className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedApplicant === application._id ? "border-primary" : ""
                            }`}
                          onClick={() => setSelectedApplicant(application._id)}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {application.applicant.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <CardTitle className="text-lg">{application.applicant.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  Applied for: {application.role}
                                </CardDescription>
                              </div>
                              <Badge variant="secondary">{application.status}</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No pending applications for this project.</p>
                    </div>
                  )
                ) : founderProjects.length > 0 ? (
                  // Show projects list
                  founderProjects.map(({ project, applications }: any) => {
                   const applicantsCount = applications.filter((app: any) => app.status === "pending").length;

                    return (
                      <Card
                        key={project._id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedProject(project._id)}
                      >
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <Badge variant="secondary">
                              {applicantsCount} {applicantsCount === 1 ? "Applicant" : "Applicants"}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No projects found.</p>
                  </div>
                )
              ) : isClient && isLoadingMyApplications ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isClient && myApplications && myApplications.length > 0 ? (
                // Non-founder view: Show applications
                filteredApplications.map((application: any) => (
                  <Card
                    key={application._id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedUserApplication && selectedUserApplication._id === application._id ? "border-primary" : ""
                      }`}
                    onClick={() => setSelectedUserApplication(application)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{application.project?.title}</CardTitle>
                        <Badge
                          variant={application.status === "accepted" ? "default" :
                            application.status === "pending" ? "secondary" : "destructive"}
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))
              ) : isClient && myApplicationsError ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Error loading your applications.</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No applications found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2">
          {selectedApplicant && selectedApplicantData && isFounder ? (
            // Founder: Show applicant profile
            <ApplicantProfile
              applicant={selectedApplicantData}
              onBack={handleBackToApplicationsList}
            />
          ) : selectedProject && isFounder ? (
            // Founder: Show project overview
            <Card className="h-[600px] flex flex-col ">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedProjectData?.project.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedProjectData?.project.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden mt-[30px]">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-6">
                    {/* Team Composition Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Team Composition</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {selectedProjectData?.project.rolesNeeded?.map((role: any, index: number) => (
                          <Card key={index} className="p-3">
                            <div className="font-medium">{role.skill}</div>
                            <div className="text-sm text-muted-foreground">
                              {role.filled || 0}/{role.count} filled
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="font-medium">Remaining Positions:</span>
                        </div>
                        <Badge variant={selectedProjectData?.project.remainingSlots > 0 ? "outline" : "secondary"}>
                          {selectedProjectData?.project.remainingSlots || 0}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Accepted Team Members Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Accepted Team Members</h3>
                      {getAcceptedApplicants().length > 0 ? (
                        <div className="space-y-3">
                          {getAcceptedApplicants().map((applicant: any) => (
                            <Card key={applicant._id} className="p-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {applicant.applicant.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">{applicant.applicant.name}</div>
                                  <div className="text-sm text-muted-foreground">{applicant.role}</div>
                                </div>
                                <Badge variant="default">Accepted</Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No team members accepted yet.</p>
                      )}
                    </div>

                    <Separator />

                    {/* Pending Applications Info */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Pending Applications</h3>
                      <p className="text-muted-foreground">
                        {getPendingApplicants().length} pending applications.
                        Select an applicant from the left panel to review their profile.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : selectedUserApplication ? (
            // Non-founder: Show application details
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">{selectedUserApplication.project?.title}</CardTitle>
                <CardDescription>
                  Status: <Badge variant={selectedUserApplication.status === "accepted" ? "default" :
                    selectedUserApplication.status === "pending" ? "secondary" : "destructive"}>
                    {selectedUserApplication.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Project Description:</h3>
                      <p className="text-muted-foreground">{selectedUserApplication.project?.description}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Role Applied For:</h3>
                      <p>{selectedUserApplication.role}</p>
                    </div>
                    {selectedUserApplication.message && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Your Message:</h3>
                          <p className="whitespace-pre-line text-muted-foreground">{selectedUserApplication.message}</p>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Application Date:</h3>
                      <p>{new Date(selectedUserApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </ScrollArea>
                {selectedUserApplication.status === "pending" && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={isCancelling}
                      onClick={async () => {
                        try {
                          await cancelApplication(selectedUserApplication._id).unwrap();
                          toast({
                            title: "Application Cancelled",
                            description: `You have successfully cancelled your application for ${selectedUserApplication.project?.title}.`,
                          });
                          // Close the application details view
                          setSelectedUserApplication(null);
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to cancel application. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Application"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            // Empty state
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  {isFounder
                    ? "Select a project to view its applications and team composition"
                    : "Select an application to view its details"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
