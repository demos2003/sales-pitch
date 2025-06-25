"use client"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, CheckCircle, XCircle, FileText, Download, ExternalLink } from "lucide-react"

interface Applicant {
  id: string
  applicantId: string
  applicantName: string
  applicantAvatar: string
  applicantRole: string
  applicantRating: string
  projectId: string
  projectTitle: string
  status: "pending" | "accepted" | "rejected"
  appliedDate: string
  interests: string[]
  skills: string[]
  reliability: number
  completedProjects: number
  hasResume: boolean
  education?: string
  experience?: string
  unreadMessages: number
}

interface ApplicantProfileProps {
  applicant: Applicant
  onMessageClick: () => void
  onAccept: () => void
  onReject: () => void
}

export function ApplicantProfile({ applicant, onMessageClick, onAccept, onReject }: ApplicantProfileProps) {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${applicant.applicantAvatar}`} />
              <AvatarFallback>{applicant.applicantAvatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{applicant.applicantName}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {applicant.applicantRole} • {applicant.applicantRating}
              </div>
            </div>
          </div>
          <Badge
            variant={
              applicant.status === "accepted" ? "success" : applicant.status === "rejected" ? "destructive" : "outline"
            }
            className="capitalize"
          >
            {applicant.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
          <span>Applied to: {applicant.projectTitle}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(applicant.appliedDate), { addSuffix: true })}</span>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 pb-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Applicant Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Reliability Score</div>
                <div className="flex items-center space-x-2">
                  <Progress value={applicant.reliability} className="h-2" />
                  <span
                    className={`text-sm ${
                      applicant.reliability >= 90
                        ? "text-green-600"
                        : applicant.reliability >= 80
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {applicant.reliability}%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Completed Projects</div>
                <div className="text-2xl font-bold">{applicant.completedProjects}</div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {applicant.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {applicant.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Education & Experience</h3>
            {applicant.education && (
              <div className="mb-2">
                <div className="text-sm font-medium">Education</div>
                <p className="text-sm">{applicant.education}</p>
              </div>
            )}
            {applicant.experience && (
              <div>
                <div className="text-sm font-medium">Experience</div>
                <p className="text-sm">{applicant.experience}</p>
              </div>
            )}
          </div>

          {applicant.hasResume && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-2">Resume</h3>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{applicant.applicantName}'s Resume.pdf</span>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Portfolio</h3>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Portfolio
            </Button>
          </div>
        </div>
      </ScrollArea>

      <CardFooter className="border-t p-4 bg-muted/20">
        <div className="flex w-full space-x-2">
          {applicant.status === "pending" && (
            <>
              <Button variant="outline" className="flex-1" onClick={onReject}>
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button className="flex-1" onClick={onAccept}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </>
          )}
          <Button
            variant={applicant.status === "pending" ? "outline" : "default"}
            className={applicant.status === "pending" ? "w-auto" : "flex-1"}
            onClick={onMessageClick}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
