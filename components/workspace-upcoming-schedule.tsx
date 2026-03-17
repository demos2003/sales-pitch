"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isAfter, isBefore } from "date-fns"
import { Calendar, Video, Circle } from "lucide-react"
import { useGetWorkspaceScheduleQuery } from "@/api/features/workspace/workspaceSlice"
import type { WorkspaceScheduleEvent } from "@/api/features/workspace/workspaceSlice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkspaceUpcomingScheduleProps {
  projectId: string
  className?: string
  maxItems?: number
}

function EventItem({
  event,
  dateStr,
  timeStr,
  highlight,
}: {
  event: WorkspaceScheduleEvent
  dateStr: string
  timeStr: string
  highlight?: boolean
}) {
  const id = event._id ?? event.id ?? ""
  return (
    <li
      key={id}
      className={cn(
        "flex flex-col gap-0.5 text-sm py-1.5 px-2 rounded-md border",
        highlight
          ? "bg-primary/10 border-primary/40"
          : "bg-background/80 border-border/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{event.title}</p>
          <p className="text-xs text-muted-foreground">
            {dateStr} · {timeStr}
          </p>
        </div>
        {event.isMeeting && event.meetingLink && (
          <Button
            variant={highlight ? "default" : "outline"}
            size="sm"
            className="shrink-0 h-7 text-xs"
            asChild
          >
            <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
              <Video className="h-3 w-3 mr-1" />
              Join
            </a>
          </Button>
        )}
      </div>
    </li>
  )
}

export function WorkspaceUpcomingSchedule({ projectId, className, maxItems = 8 }: WorkspaceUpcomingScheduleProps) {
  const [now, setNow] = useState(() => new Date())
  const { data: events = [], isLoading } = useGetWorkspaceScheduleQuery(projectId, { skip: !projectId })

  // Update "now" every 15 seconds so "Happening now" appears when it's time and ended events go away
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])

  const happeningNow = events.filter((e) => {
    const start = parseISO(e.start)
    const end = parseISO(e.end)
    return !isAfter(start, now) && !isBefore(end, now)
  })

  const upcoming = events
    .filter((e) => isAfter(parseISO(e.start), now))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, maxItems)

  if (!projectId) return null
  if (isLoading) {
    return (
      <div className={cn("p-3 border-b bg-muted/20", className)}>
        <p className="text-xs text-muted-foreground">Loading schedule...</p>
      </div>
    )
  }
  if (happeningNow.length === 0 && upcoming.length === 0) {
    return (
      <div className={cn("p-3 border-b bg-muted/20", className)}>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          No upcoming schedule. Add events in the Schedule tab.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("p-3 border-b bg-muted/20 space-y-3", className)}>
      {happeningNow.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-primary flex items-center gap-1.5">
            <Circle className="h-2 w-2 fill-current animate-pulse" />
            Happening now
          </p>
          <ul className="space-y-1.5">
            {happeningNow.map((event) => {
              const start = parseISO(event.start)
              const end = parseISO(event.end)
              const dateStr = format(start, "EEE, MMM d")
              const timeStr = event.allDay ? "All day" : `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`
              return <EventItem key={event._id ?? event.id} event={event} dateStr={dateStr} timeStr={timeStr} highlight />
            })}
          </ul>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Upcoming
          </p>
          <ul className="space-y-1.5">
            {upcoming.map((event) => {
              const start = parseISO(event.start)
              const end = parseISO(event.end)
              const dateStr = format(start, "EEE, MMM d")
              const timeStr = event.allDay ? "All day" : `${format(start, "h:mm a")} – ${format(end, "h:mm a")}`
              return <EventItem key={event._id ?? event.id} event={event} dateStr={dateStr} timeStr={timeStr} />
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
