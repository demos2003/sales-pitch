"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function CreateProjectPage() {
  const [step, setStep] = useState(1)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold">Create a New Project</h1>
          <p className="text-muted-foreground">Share your vision and find the perfect team to bring it to life</p>
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
                <Input id="title" placeholder="E.g., AI-Powered Health Tracking App" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your project in 1-2 sentences"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long-description">Detailed Description</Label>
                <Textarea
                  id="long-description"
                  placeholder="Provide a comprehensive overview of your project, including your vision, goals, and any progress made so far"
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Project Type</Label>
                <RadioGroup defaultValue="startup">
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
                <Label htmlFor="team-size">Team Size</Label>
                <Select defaultValue="3-5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 members</SelectItem>
                    <SelectItem value="3-5">3-5 members</SelectItem>
                    <SelectItem value="6-10">6-10 members</SelectItem>
                    <SelectItem value="10+">10+ members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roles Needed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="developer" />
                    <Label htmlFor="developer">Developer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="designer" />
                    <Label htmlFor="designer">Designer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pm" />
                    <Label htmlFor="pm">Product Manager</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="qa" />
                    <Label htmlFor="qa">QA Engineer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" />
                    <Label htmlFor="marketing">Marketing Specialist</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data" />
                    <Label htmlFor="data">Data Scientist</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="List specific skills or technologies needed (e.g., React, Node.js, UI/UX, etc.)"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commitment">Time Commitment</Label>
                <Select defaultValue="part-time">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time commitment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="few-hours">A few hours per week</SelectItem>
                    <SelectItem value="part-time">Part-time (10-20 hours/week)</SelectItem>
                    <SelectItem value="full-time">Full-time (20+ hours/week)</SelectItem>
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
                <Select defaultValue="3-6">
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
                <RadioGroup defaultValue="equity">
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
                  id="compensation-details"
                  placeholder="Provide details about equity, profit sharing, or other compensation arrangements"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Any other details you'd like to share about your project"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button>Create Project</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
