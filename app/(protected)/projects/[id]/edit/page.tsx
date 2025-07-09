"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetProjectByIdQuery, useUpdateProjectMutation } from "@/api/features/projects/projectsSlice"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"

export default function EditProjectPage() {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const { data: projectDataFetched, isLoading: isFetchingProject, isError: isProjectError } = useGetProjectByIdQuery(projectId)
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation()

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    projectType: "startup",
    teamSize: "3-5",
    rolesNeeded: [
      { skill: "", count: 1 }
    ],
    skillSummary: "",
    timeCommitment: "part_time",
    timeline: "3-6",
    compensation: "equity",
    otherCompensationDetail: "",
    outcomes: "",
  })

  // Function to map API timeline to component timeline
  const mapTimelineFromApi = (apiTimeline: string) => {
    if (!apiTimeline) return "3-6"
    
    const timeline = apiTimeline.toLowerCase()
    if (timeline.includes("week") || timeline.includes("month")) {
      const number = parseInt(timeline)
      if (number < 1) return "0-1"
      if (number <= 3) return "1-3"
      if (number <= 6) return "3-6"
      if (number <= 12) return "6-12"
      return "ongoing"
    }
    return "3-6" // default
  }

  // Function to map API project type to component project type
  const mapProjectTypeFromApi = (apiType: string) => {
    const typeMap: { [key: string]: string } = {
      "personal_project": "personal",
      "startup": "startup",
      "open_source": "open-source",
      "social_impact": "social-impact",
      "non_profit": "social-impact"
    }
    return typeMap[apiType] || "startup"
  }

  // Function to map API compensation array to single value
  const mapCompensationFromApi = (apiCompensation: string[] | string) => {
    if (Array.isArray(apiCompensation)) {
      // Take the first compensation type or default to equity
      const firstComp = apiCompensation[0]
      if (firstComp === "portfolio") return "portfolio"
      if (firstComp === "future_paid") return "future"
      if (firstComp === "equity") return "equity"
      return "equity"
    }
    return apiCompensation || "equity"
  }

  useEffect(() => {
    if (projectDataFetched) {
      console.log("API Data:", projectDataFetched) // Debug log
      
      setProjectData({
        title: projectDataFetched.title || "",
        description: projectDataFetched.description || "",
        // Map API 'type' to component 'projectType'
        projectType: mapProjectTypeFromApi(projectDataFetched.type),
        teamSize: projectDataFetched.teamSize || "3-5",
        rolesNeeded: projectDataFetched.rolesNeeded || [{ skill: "", count: 1 }],
        skillSummary: projectDataFetched.skillSummary || "",
        timeCommitment: projectDataFetched.timeCommitment || "part_time",
        // Map API timeline to component timeline
        timeline: mapTimelineFromApi(projectDataFetched.timeline),
        // Map API compensation array to single value
        compensation: mapCompensationFromApi(projectDataFetched.compensation),
        otherCompensationDetail: projectDataFetched.otherCompensationDetail || "",
        outcomes: projectDataFetched.outcomes || "",
      })
    }
  }, [projectDataFetched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setProjectData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProjectTypeChange = (value: string) => {
    setProjectData((prev) => ({ ...prev, projectType: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (index: number, field: "skill" | "count", value: string | number) => {
    const updatedRoles = [...projectData.rolesNeeded];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value
    };
    setProjectData({ ...projectData, rolesNeeded: updatedRoles });
  };

  const addRole = () => {
    setProjectData({
      ...projectData,
      rolesNeeded: [...projectData.rolesNeeded, { skill: "", count: 1 }]
    });
  };

  const removeRole = (index: number) => {
    const updatedRoles = [...projectData.rolesNeeded];
    updatedRoles.splice(index, 1);
    setProjectData({ ...projectData, rolesNeeded: updatedRoles });
  };

  // Function to map component data back to API format
  const mapDataForApi = (data: typeof projectData) => {
    const projectTypeMap: { [key: string]: string } = {
      "personal": "personal_project",
      "startup": "startup",
      "open-source": "open_source",
      "social-impact": "social_impact"
    }

    const timelineMap: { [key: string]: string } = {
      "0-1": "Less than 1 month",
      "1-3": "1-3 months",
      "3-6": "3-6 months",
      "6-12": "6-12 months",
      "ongoing": "Ongoing"
    }

    const compensationMap: { [key: string]: string[] } = {
      "equity": ["equity"],
      "portfolio": ["portfolio"],
      "future": ["future_paid"],
      "other": ["other"]
    }

    return {
      ...data,
      type: projectTypeMap[data.projectType] || "startup",
      timeline: timelineMap[data.timeline] || "3-6 months",
      compensation: compensationMap[data.compensation] || ["equity"]
    }
  }

const handleSubmit = async () => {
  try {
    // Map the component data to API format
    const mappedData = mapDataForApi(projectData)
    
    const payload = {
      id: projectId,
      data: mappedData,  // Wrap mappedData in 'data' property
    }

    console.log("Payload being sent:", payload) // Debug log

    await updateProject(payload).unwrap()
    toast("Project updated successfully!");
     router.push(`/projects`);
  } catch (error: any) {
    toast("Failed to update project")
  }
}

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (isFetchingProject) {
    return <div className="container py-10 text-center">Loading project data...</div>
  }

  if (isProjectError) {
    return <div className="container py-10 text-center text-red-500">Error loading project data.</div>
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">Update your project details</p>
        </div>

        <div className="flex justify-between mb-8">
          <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              1
            </div>
            <span className="text-sm mt-1">Basics</span>
          </div>
          <div className="grow border-t my-5 mx-4"></div>
          <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              2
            </div>
            <span className="text-sm mt-1">Team</span>
          </div>
          <div className="grow border-t my-5 mx-4"></div>
          <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-primary bg-primary/10" : "border-muted"}`}
            >
              3
            </div>
            <span className="text-sm mt-1">Details</span>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Basics</CardTitle>
              <CardDescription>Tell us about your project idea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="E.g., AI-Powered Health Tracking App" value={projectData.title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long-description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a comprehensive overview of your project, including your vision, goals, and any progress made so far"
                  className="min-h-[150px]"
                  value={projectData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Type</Label>
                <RadioGroup value={projectData.projectType} onValueChange={handleProjectTypeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="startup" id="startup" />
                    <Label htmlFor="startup">Startup / Business Venture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open-source" id="open-source" />
                    <Label htmlFor="open-source">Open Source Project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="social-impact" id="social-impact" />
                    <Label htmlFor="social-impact">Social Impact / Non-profit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">Personal / Side Project</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={nextStep}>Next: Team Requirements</Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Team Requirements</CardTitle>
              <CardDescription>Specify the roles and skills you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Roles Needed</Label>

                {projectData.rolesNeeded.length === 0 && (
                  <p className="text-sm text-muted-foreground">No roles added yet.</p>
                )}

                {projectData.rolesNeeded.map((role, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={role.skill}
                      onValueChange={(value) => handleRoleChange(index, "skill", value)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="uiux">UI/UX Designer</SelectItem>
                        <SelectItem value="pm">Project Manager</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min={1}
                      value={role.count}
                      className="w-20"
                      onChange={(e) => handleRoleChange(index, "count", Number(e.target.value))}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRole(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRole}
                  className="mt-2"
                >
                  Add Role
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Textarea
                  id="skillSummary"
                  placeholder="List specific skills or technologies needed (e.g., React, Node.js, UI/UX, etc.)"
                  className="min-h-[100px]"
                  value={projectData.skillSummary}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commitment">Time Commitment</Label>
                <Select value={projectData.timeCommitment} onValueChange={(value) => handleSelectChange("timeCommitment", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="few_hours_per_week">A few hours per week</SelectItem>
                    <SelectItem value="part_time">Part-time (10-20 hours/week)</SelectItem>
                    <SelectItem value="full_time">Full-time (20+ hours/week)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next: Project Details</Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Provide additional information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Project Timeline</Label>
                <Select value={projectData.timeline} onValueChange={(value) => handleSelectChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 month</SelectItem>
                    <SelectItem value="1-3">1-3 months</SelectItem>
                    <SelectItem value="3-6">3-6 months</SelectItem>
                    <SelectItem value="6-12">6-12 months</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Compensation</Label>
                <RadioGroup value={projectData.compensation} onValueChange={(value) => handleRadioChange("compensation", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equity" id="equity" />
                    <Label htmlFor="equity">Equity / Profit Sharing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="portfolio" id="portfolio" />
                    <Label htmlFor="portfolio">Portfolio Building</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="future" id="future" />
                    <Label htmlFor="future">Future Paid Opportunity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other (specify below)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compensation-details">Compensation Details</Label>
                <Textarea
                  id="otherCompensationDetail"
                  placeholder="Provide details about equity, profit sharing, or other compensation arrangements"
                  className="min-h-[100px]"
                  value={projectData.otherCompensationDetail}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Outcomes</Label>
                <Textarea
                  id="outcomes"
                  placeholder="What is the desired endgoal or expected outcome of this project"
                  className="min-h-[100px]"
                  value={projectData.outcomes}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isUpdatingProject}>
                {isUpdatingProject ? "Updating..." : "Update Project"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}