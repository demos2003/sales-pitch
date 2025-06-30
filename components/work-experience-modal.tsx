"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Briefcase } from "lucide-react"

interface WorkExperience {
  id?: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrentJob: boolean
  description: string
  employmentType: string
}

interface WorkExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (experience: WorkExperience) => void
  experience?: WorkExperience | null
  mode: "add" | "edit"
}

export function WorkExperienceModal({ isOpen, onClose, onSave, experience, mode }: WorkExperienceModalProps) {
  const [formData, setFormData] = useState<WorkExperience>({
    jobTitle: experience?.jobTitle || "",
    company: experience?.company || "",
    location: experience?.location || "",
    startDate: experience?.startDate || "",
    endDate: experience?.endDate || "",
    isCurrentJob: experience?.isCurrentJob || false,
    description: experience?.description || "",
    employmentType: experience?.employmentType || "full-time",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required"
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required"
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }
    if (!formData.isCurrentJob && !formData.endDate) {
      newErrors.endDate = "End date is required if not current job"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const experienceData = {
      ...formData,
      id: experience?.id || Date.now().toString(),
    }

    onSave(experienceData)

    toast({
      title: mode === "add" ? "Experience added" : "Experience updated",
      description: `Your work experience at ${formData.company} has been ${mode === "add" ? "added" : "updated"} successfully.`,
    })

    handleClose()
  }

  const handleClose = () => {
    setFormData({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: "",
      employmentType: "full-time",
    })
    setErrors({})
    onClose()
  }

  const handleCurrentJobChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isCurrentJob: checked,
      endDate: checked ? "" : formData.endDate,
    })
    if (checked && errors.endDate) {
      const newErrors = { ...errors }
      delete newErrors.endDate
      setErrors(newErrors)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <DialogTitle>{mode === "add" ? "Add Work Experience" : "Edit Work Experience"}</DialogTitle>
          </div>
          <DialogDescription>
            {mode === "add"
              ? "Add your professional work experience to showcase your background."
              : "Update your work experience details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className={errors.jobTitle ? "border-red-500" : ""}
              />
              {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g., Tech Company Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
              >
                <SelectTrigger id="employmentType">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date {!formData.isCurrentJob && "*"}</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.isCurrentJob}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="currentJob" checked={formData.isCurrentJob} onCheckedChange={handleCurrentJobChange} />
            <Label htmlFor="currentJob">I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your role, responsibilities, and key achievements..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">
              Include your key responsibilities, achievements, and technologies used.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{mode === "add" ? "Add Experience" : "Update Experience"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
