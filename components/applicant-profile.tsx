"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Calendar, MessageSquare, User, Briefcase } from "lucide-react"
import { useUpdateApplicationStatusMutation } from "@/api/features/application/applicationSlice"
import { toast } from "sonner"
import { useGetApplicationsGroupedByProjectForFounderQuery } from "@/api/features/application/applicationSlice"
import { ChatButton } from "@/components/chat/chat-button"


interface ApplicantProfileProps {
  applicant: {
    _id: string
    applicant: {
      _id: string
      name: string
      email: string
      primaryRole?: string
    }
    role: string
    status: string
    message: string
    createdAt: string
    project: {
      _id: string
      title: string
      description: string
    }
  }
  onBack: () => void // ✅ this will be called after success (go back to project detail)
}

export function ApplicantProfile({ applicant, onBack }: ApplicantProfileProps) {
  const [showModal, setShowModal] = useState<"accepted" | "rejected" | null>(null)
  const [updateApplicationStatus, { isLoading }] = useUpdateApplicationStatusMutation()
  const { refetch } = useGetApplicationsGroupedByProjectForFounderQuery(undefined, {
  skip: false, // don’t skip, we want to refresh the data
});
  

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleConfirm = async () => {
    if (!showModal) return
    try {
      await updateApplicationStatus({
        id: applicant._id,
        projectId: applicant.project._id,
        status: showModal,
      }).unwrap()
      await refetch();
      
      toast.success(`Application ${showModal}`)
      setShowModal(null)
      onBack() // ✅ go back to project overview
    } catch (err) {
      toast.error("Failed to update application status")
      console.log(err)
    }
  }

  return (
    <>
      {/* ✅ Confirmation Modal */}
      <Dialog open={!!showModal} onOpenChange={() => setShowModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to {showModal} this application?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowModal(null)}
              variant="secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={showModal === "rejected" ? "destructive" : "default"}
              loading={isLoading}
            >
              {isLoading ? "Processing..." : `Yes, ${showModal}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicant Profile UI */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(applicant.applicant.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{applicant.applicant.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {applicant.applicant.email}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getStatusColor(applicant.status)}>
                  {applicant.status}
                </Badge>
                <Badge variant="outline">
                  Applied for: {applicant.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Project Info */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                  <Briefcase className="h-5 w-5" />
                  Project Details
                </h3>
                <Card className="p-4">
                  <h4 className="font-medium">{applicant.project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {applicant.project.description}
                  </p>
                </Card>
              </div>

              <Separator />

              {applicant.applicant.primaryRole && (
                <>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                      <User className="h-5 w-5" />
                      Primary Role
                    </h3>
                    <p className="text-muted-foreground">{applicant.applicant.primaryRole}</p>
                  </div>
                  <Separator />
                </>
              )}

              {applicant.message && (
                <>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                      <MessageSquare className="h-5 w-5" />
                      Application Message
                    </h3>
                    <Card className="p-4">
                      <p className="text-sm whitespace-pre-line">
                        {applicant.message}
                      </p>
                    </Card>
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <h3 className="flex items-center gap-2 text-lg font-medium mb-3">
                  <Calendar className="h-5 w-5" />
                  Application Date
                </h3>
                <p className="text-muted-foreground">
                  {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="pt-4 border-t mt-4">
            <div className="flex gap-3">
              {/* Chat Button - always visible */}
              <ChatButton
                projectId={applicant.project._id}
                contributorId={applicant.applicant._id}
                contributorName={applicant.applicant.name}
                projectTitle={applicant.project.title}
                className="flex-1"
                size="lg"
              />
              
              {/* Action buttons - only for pending applications */}
              {applicant.status === "pending" && (
                <>
                  <Button
                    onClick={() => setShowModal("accepted")}
                    className="flex-1"
                    size="lg"
                    disabled={isLoading}
                    variant="accent"
                  >
                    Accept Application
                  </Button>
                  <Button
                    onClick={() => setShowModal("rejected")}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                    disabled={isLoading}
                  >
                    Reject Application
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
