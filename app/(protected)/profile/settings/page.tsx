"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
// import { useAuth } from "@/context/auth-context"
import { Upload, X, Save, FileText } from "lucide-react"
import { InterestSelectionModal } from "@/components/interest-selection-modal"
import { useGetCurrentUserQuery, useToggle2faMutation } from "@/api/features/auth/authApiSlice"


export default function ProfileSettingsPage() {
  // const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)

  // Mock data for a tech creative profile
  const [profile, setProfile] = useState({
    name: "Jane Smith",
    email: "jane@example.com",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5 years of experience building web and mobile applications. I love working on innovative projects that challenge me to learn new technologies.",
    location: "San Francisco, CA",
    website: "https://janesmith.dev",
    github: "github.com/janesmith",
    linkedin: "linkedin.com/in/janesmith",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL"],
    experience: "5+ years",
    availability: "part-time",
    interests: ["AI", "Web Development", "Mobile Apps"],
    education: "BS Computer Science, Stanford University",
    languages: ["English", "Spanish"],
  })

  const { data: user, isLoading, error, refetch } = useGetCurrentUserQuery()
  const [toggle2fa, { isLoading: isToggling }] = useToggle2faMutation()

  const handleToggle2FA = async () => {
    try {
      await toggle2fa(undefined).unwrap()
      await refetch()
      toast({
        title: "2FA Toggled",
        description: `Two-factor authentication has been ${user?.is2faEnabled ? "disabled" : "enabled"}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to toggle 2FA. Please try again.",
        variant: "destructive",
      })
    }
  }


  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the profile
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to change the password
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    })
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setResumeUploaded(true)
      toast({
        title: "Resume uploaded",
        description: `File "${file.name}" has been uploaded successfully.`,
      })
    }
  }

  const handleInterestsSave = (selectedInterests: string[]) => {
    setProfile({
      ...profile,
      interests: selectedInterests,
    })
    setShowInterestModal(false)
    toast({
      title: "Interests updated",
      description: "Your interests have been saved successfully.",
    })
  }



  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile information and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Button
                variant={activeTab === "general" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("general")}
              >
                General Information
              </Button>
              <Button
                variant={activeTab === "skills" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("skills")}
              >
                Skills & Interests
              </Button>
              <Button
                variant={activeTab === "resume" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("resume")}
              >
                Resume & Portfolio
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("security")}
              >
                Security
              </Button>
              <Button
                variant={activeTab === "preferences" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("preferences")}
              >
                Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description of your professional background and interests.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "skills" && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
                <CardDescription>Manage your skills and areas of interest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Technical Skills</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add the technologies and skills you're proficient in.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <button
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              setProfile({
                                ...profile,
                                skills: profile.skills.filter((s) => s !== skill),
                              })
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill (e.g., React, Python)"
                        id="new-skill"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const input = e.currentTarget
                            if (input.value && !profile.skills.includes(input.value)) {
                              setProfile({
                                ...profile,
                                skills: [...profile.skills, input.value],
                              })
                              input.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("new-skill") as HTMLInputElement
                          if (input.value && !profile.skills.includes(input.value)) {
                            setProfile({
                              ...profile,
                              skills: [...profile.skills, input.value],
                            })
                            input.value = ""
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base">Areas of Interest</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the areas you're interested in working on.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} className="px-3 py-1">
                          {interest}
                          <button
                            className="ml-2 text-primary-foreground hover:text-primary-foreground/80"
                            onClick={() =>
                              setProfile({
                                ...profile,
                                interests: profile.interests.filter((i) => i !== interest),
                              })
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => setShowInterestModal(true)}>
                      Edit Interests
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select
                        value={profile.experience}
                        onValueChange={(value) => setProfile({ ...profile, experience: value })}
                      >
                        <SelectTrigger id="experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select
                        value={profile.availability}
                        onValueChange={(value) => setProfile({ ...profile, availability: value })}
                      >
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time (40+ hrs/week)</SelectItem>
                          <SelectItem value="part-time">Part-time (10-20 hrs/week)</SelectItem>
                          <SelectItem value="limited">Limited (5-10 hrs/week)</SelectItem>
                          <SelectItem value="weekends">Weekends only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "resume" && (
            <Card>
              <CardHeader>
                <CardTitle>Resume & Portfolio</CardTitle>
                <CardDescription>Upload your resume and showcase your work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Resume</Label>
                  <p className="text-sm text-muted-foreground">
                    Upload your resume to make it easier for founders to review your qualifications.
                  </p>

                  {resumeUploaded ? (
                    <div className="flex items-center p-4 border rounded-md">
                      <FileText className="h-8 w-8 text-muted-foreground mr-4" />
                      <div className="flex-1">
                        <p className="font-medium">{resumeFile?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setResumeFile(null)
                          setResumeUploaded(false)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-8">
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-sm font-medium mb-1">Drag and drop your resume here</p>
                      <p className="text-xs text-muted-foreground mb-4">PDF, DOCX, or TXT. Max size of 5MB.</p>
                      <div className="relative">
                        <Input
                          id="resume-upload"
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleResumeUpload}
                        />
                        <Button variant="outline">Browse Files</Button>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base">Portfolio Projects</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add links to your best work to showcase your skills.
                  </p>

                  <div className="space-y-4">
                    <div className="grid gap-4 p-4 border rounded-md">
                      <div className="grid gap-2">
                        <Label htmlFor="project-title-1">Project Title</Label>
                        <Input id="project-title-1" placeholder="E-commerce Website" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="project-url-1">Project URL</Label>
                        <Input id="project-url-1" placeholder="https://example.com" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="project-description-1">Description</Label>
                        <Textarea
                          id="project-description-1"
                          placeholder="Brief description of the project and your role"
                          rows={2}
                        />
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      + Add Another Project
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" required />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters and include a number and a special character.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  <Button type="submit">Change Password</Button>
                </form>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account.
                    </p>
                    {isLoading ? (
                      <p>Checking 2FA status...</p>
                    ) : error ? (
                      <p className="text-destructive">Failed to load 2FA status</p>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleToggle2FA}
                        disabled={isToggling}
                      >
                        {isToggling
                          ? "Processing..."
                          : user?.is2faEnabled
                            ? "Disable 2FA"
                            : "Enable 2FA"}
                      </Button>
                    )}

                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium">Login Sessions</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Manage your active sessions and sign out from other devices.
                    </p>
                    <div className="p-4 border rounded-md mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">San Francisco, CA • Chrome on macOS</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Sign Out From All Other Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience on Sales Pitch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-projects" defaultChecked />
                      <Label htmlFor="notify-projects">New project recommendations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-applications" defaultChecked />
                      <Label htmlFor="notify-applications">Application status updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-messages" defaultChecked />
                      <Label htmlFor="notify-messages">New messages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-team" defaultChecked />
                      <Label htmlFor="notify-team">Team updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-marketing" />
                      <Label htmlFor="notify-marketing">Marketing and promotional emails</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Project Preferences</h3>
                  <div className="space-y-2">
                    <Label htmlFor="project-types">Preferred Project Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-startup" defaultChecked />
                        <Label htmlFor="type-startup">Startups</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-open-source" defaultChecked />
                        <Label htmlFor="type-open-source">Open Source</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-social" defaultChecked />
                        <Label htmlFor="type-social">Social Impact</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="type-personal" />
                        <Label htmlFor="type-personal">Personal Projects</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="remote-preference">Remote Work Preference</Label>
                    <Select defaultValue="remote">
                      <SelectTrigger id="remote-preference">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote Only</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Remote & On-site)</SelectItem>
                        <SelectItem value="onsite">On-site Only</SelectItem>
                        <SelectItem value="any">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="privacy-profile" defaultChecked />
                      <Label htmlFor="privacy-profile">Make my profile visible to project founders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="privacy-skills" defaultChecked />
                      <Label htmlFor="privacy-skills">Show my skills and experience</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="privacy-contact" />
                      <Label htmlFor="privacy-contact">Allow founders to contact me directly</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      <InterestSelectionModal
        isOpen={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        onSave={handleInterestsSave}
        selectedInterests={profile.interests}
      />
    </div>
  )
}
