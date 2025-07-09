"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Application {
  _id: string
  applicantId?: string
  name?: string
  applicantAvatar?: string
  role?: string
  applicantRating?: string
  founderId?: string
  founderName?: string
  founderAvatar?: string
  founderRole?: string
  founderRating?: string
  projectId: string
  projectTitle: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  interests: string[]
  skills: string[]
  reliability: number
  completedProjects: number
  hasResume: boolean
  education?: string
  experience?: string
  unreadMessages: number
}

interface ProjectApplicationsListProps {
  applications: Application[]
  isFounder?: boolean
  onSelect: (id: string) => void
  selectedId: string | null
}

export function ProjectApplicationsList({
  applications,
  isFounder = true,
  onSelect,
  selectedId,
}: ProjectApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No applications found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <Card
          key={application.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedId === application._id ? "border-primary" : ""
            }`}
          onClick={() => onSelect(application._id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40&text=${isFounder ? application.applicantAvatar : application.founderAvatar
                    }`}
                />
                <AvatarFallback>{isFounder ? application.applicantAvatar : application.founderAvatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{isFounder ? application?.applicant.name : application.founderName}</div>
                  <Badge
                    variant={
                      application.status === "accepted"
                        ? "default"
                        : application.status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {application.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-between">
                  <span>
                    {isFounder ? application.role : application.founderRole}
                  </span>
                  <span className="text-xs">
                    {application.createdAt ? (
                      formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })
                    ) : (
                      "N/A"
                    )}

                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Reliability:</span>
                    <span
                      className={
                        application.reliability >= 90
                          ? "text-green-600"
                          : application.reliability >= 80
                            ? "text-amber-600"
                            : "text-red-600"
                      }
                    >
                      90%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium mr-1">Projects:</span>
                    {/* <span>{application.completedProjects}</span> */}
                    <span>0</span>
                  </div>
                </div>
                {/* <div className="flex flex-wrap gap-1 mt-1">
                  {application.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {application.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.skills.length - 3} more
                    </Badge>
                  )}
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
