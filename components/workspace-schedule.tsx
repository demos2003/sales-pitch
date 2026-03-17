"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
  setHours,
  setMinutes,
  startOfDay,
  differenceInMinutes,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Trash2, LayoutGrid } from "lucide-react"
import { useGetWorkspaceScheduleQuery, useCreateScheduleEventMutation, useUpdateScheduleEventMutation, useDeleteScheduleEventMutation } from "@/api/features/workspace/workspaceSlice"
import type { WorkspaceScheduleEvent } from "@/api/features/workspace/workspaceSlice"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface WorkspaceScheduleProps {
  projectId: string
  projectName: string
}

const DAY_VIEW_START_HOUR = 8
const DAY_VIEW_END_HOUR = 22
const HOURS = Array.from({ length: DAY_VIEW_END_HOUR - DAY_VIEW_START_HOUR + 1 }, (_, i) => DAY_VIEW_START_HOUR + i)

export function WorkspaceSchedule({ projectId, projectName }: WorkspaceScheduleProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "day">("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<WorkspaceScheduleEvent | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formStart, setFormStart] = useState("")
  const [formEnd, setFormEnd] = useState("")
  const [formAllDay, setFormAllDay] = useState(false)
  const [formDescription, setFormDescription] = useState("")
  const [formIsMeeting, setFormIsMeeting] = useState(false)
  const [formMeetingLink, setFormMeetingLink] = useState("")

  const { data: events = [], isLoading, isError } = useGetWorkspaceScheduleQuery(projectId, { skip: !projectId })
  const [createEvent, { isLoading: isCreating }] = useCreateScheduleEventMutation()
  const [updateEvent, { isLoading: isUpdating }] = useUpdateScheduleEventMutation()
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteScheduleEventMutation()

  const eventId = (e: WorkspaceScheduleEvent) => e._id ?? e.id ?? ""

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays: Date[] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    calendarDays.push(day)
    day = addDays(day, 1)
  }

  const eventsForDay = (date: Date) =>
    events.filter((e) => {
      const start = parseISO(e.start)
      const end = parseISO(e.end)
      return isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end)
    })

  const dayStart = startOfDay(selectedDate)
  const eventsForSelectedDay = eventsForDay(selectedDate)
  const timedEventsForDay = eventsForSelectedDay.filter((e) => !e.allDay).map((ev) => {
    const start = parseISO(ev.start)
    const end = parseISO(ev.end)
    const dayStartAt = setHours(dayStart, DAY_VIEW_START_HOUR)
    const dayEndAt = setHours(dayStart, DAY_VIEW_END_HOUR + 1)
    const clampStart = start < dayStartAt ? dayStartAt : start
    const clampEnd = end > dayEndAt ? dayEndAt : end
    const topMin = differenceInMinutes(clampStart, dayStartAt)
    const durationMin = differenceInMinutes(clampEnd, clampStart)
    const totalMin = (DAY_VIEW_END_HOUR - DAY_VIEW_START_HOUR + 1) * 60
    return {
      ...ev,
      topPct: (topMin / totalMin) * 100,
      heightPct: Math.max((durationMin / totalMin) * 100, 4),
    }
  })
  const allDayEventsForDay = eventsForSelectedDay.filter((e) => e.allDay)

  const openNewDialog = (date?: Date, startHour: number = 9, endHour: number = 10) => {
    const d = date || new Date()
    const startStr = format(setMinutes(setHours(startOfDay(d), startHour), 0), "yyyy-MM-dd'T'HH:mm")
    const endStr = format(setMinutes(setHours(startOfDay(d), endHour), 0), "yyyy-MM-dd'T'HH:mm")
    setEditingEvent(null)
    setFormTitle("")
    setFormStart(startStr)
    setFormEnd(endStr)
    setFormAllDay(false)
    setFormDescription("")
    setFormIsMeeting(false)
    setFormMeetingLink("")
    setDialogOpen(true)
  }

  const goToDayView = (date: Date) => {
    setSelectedDate(date)
    setViewMode("day")
  }

  const goToMonthView = () => {
    setViewMode("month")
  }

  const openEditDialog = (event: WorkspaceScheduleEvent) => {
    setEditingEvent(event)
    setFormTitle(event.title)
    setFormStart(event.start.slice(0, 16))
    setFormEnd(event.end.slice(0, 16))
    setFormAllDay(!!event.allDay)
    setFormDescription(event.description ?? "")
    setFormIsMeeting(!!event.isMeeting)
    setFormMeetingLink(event.meetingLink ?? "")
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formTitle.trim()) {
      toast({ title: "Title required", variant: "destructive" })
      return
    }
    const start = formAllDay ? formStart.slice(0, 10) + "T00:00:00" : new Date(formStart).toISOString()
    const end = formAllDay ? formEnd.slice(0, 10) + "T23:59:59" : new Date(formEnd).toISOString()
    if (new Date(end) <= new Date(start)) {
      toast({ title: "End must be after start", variant: "destructive" })
      return
    }
    const isMeeting = formIsMeeting
    const meetingLink = formIsMeeting && formMeetingLink.trim() ? formMeetingLink.trim() : undefined
    try {
      if (editingEvent && eventId(editingEvent)) {
        await updateEvent({
          projectId,
          eventId: eventId(editingEvent),
          event: { title: formTitle.trim(), start, end, allDay: formAllDay, description: formDescription.trim() || undefined, isMeeting, meetingLink },
        }).unwrap()
        toast({ title: "Event updated" })
      } else {
        await createEvent({
          projectId,
          event: { title: formTitle.trim(), start, end, allDay: formAllDay, description: formDescription.trim() || undefined, isMeeting, meetingLink },
        }).unwrap()
        toast({ title: "Event added" })
      }
      setDialogOpen(false)
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.message ?? "Request failed"
      toast({ title: "Error", description: msg, variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!editingEvent || !eventId(editingEvent)) return
    try {
      await deleteEvent({ projectId, eventId: eventId(editingEvent) }).unwrap()
      toast({ title: "Event deleted" })
      setDialogOpen(false)
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.data?.message, variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Schedule</h3>
          {viewMode === "day" && (
            <Button variant="ghost" size="sm" onClick={goToMonthView} className="text-muted-foreground">
              <LayoutGrid className="h-4 w-4 mr-1" />
              Month
            </Button>
          )}
        </div>
        <Button size="sm" onClick={() => openNewDialog(viewMode === "day" ? selectedDate : undefined)}>
          <Plus className="h-4 w-4 mr-1" />
          Add event
        </Button>
      </div>
      {isError && (
        <p className="text-xs text-muted-foreground px-4 py-2 bg-muted/50 rounded mx-4 mt-2">
          Schedule sync requires the backend schedule API. See docs/WORKSPACE_SCHEDULE_API.md.
        </p>
      )}

      {viewMode === "month" && (
        <>
          <div className="p-4 flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm">{format(currentMonth, "MMMM yyyy")}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex-1 grid grid-cols-7 gap-px p-4 bg-muted/30 rounded-lg">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="bg-background min-h-[80px] rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground px-4 pb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center">{d}</div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 gap-px p-4 bg-muted/30 rounded-lg min-h-[400px]">
                {calendarDays.map((date) => {
                  const dayEvents = eventsForDay(date)
                  const isCurrentMonth = isSameMonth(date, currentMonth)
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "bg-background rounded min-h-[80px] p-1 flex flex-col",
                        !isCurrentMonth && "opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => goToDayView(date)}
                          className={cn(
                            "text-sm w-7 h-7 rounded flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors",
                            isSameDay(date, new Date()) && "bg-primary text-primary-foreground"
                          )}
                        >
                          {format(date, "d")}
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <button
                            key={eventId(ev)}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openEditDialog(ev) }}
                            className="w-full text-left text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate hover:bg-primary/20"
                          >
                            {ev.title}
                          </button>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-muted-foreground px-1">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}

      {viewMode === "day" && (
        <div className="flex flex-col flex-1 overflow-hidden p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[200px] text-center">
                {format(selectedDate, "EEEE, MMM d, yyyy")}
              </span>
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => openNewDialog(selectedDate)}>
              <Plus className="h-4 w-4 mr-1" />
              Add event
            </Button>
          </div>

          {allDayEventsForDay.length > 0 && (
            <div className="mb-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">All day</p>
              <div className="flex flex-wrap gap-1">
                {allDayEventsForDay.map((ev) => (
                  <button
                    key={eventId(ev)}
                    type="button"
                    onClick={() => openEditDialog(ev)}
                    className="text-xs px-2 py-1 rounded bg-primary/15 text-primary hover:bg-primary/25 truncate max-w-[180px]"
                  >
                    {ev.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 flex min-h-0 rounded-lg border bg-muted/20 overflow-hidden">
            <div className="w-14 shrink-0 flex flex-col text-xs text-muted-foreground border-r">
              {HOURS.map((h) => (
                <div key={h} className="h-12 flex items-start justify-end pr-2 pt-0.5">
                  {format(setHours(new Date(), h), "h a")}
                </div>
              ))}
            </div>
            <div className="flex-1 relative min-w-0">
              <div className="absolute inset-0 flex flex-col">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => openNewDialog(selectedDate, h, h + 1)}
                    className="h-12 flex-1 min-h-[48px] border-b border-border/50 hover:bg-primary/5 transition-colors last:border-b-0"
                    aria-label={`Add event at ${format(setHours(new Date(), h), "h a")}`}
                  />
                ))}
              </div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="relative w-full h-full pointer-events-none">
                  {timedEventsForDay.map((ev) => (
                    <button
                      key={eventId(ev)}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEditDialog(ev) }}
                      className="absolute left-1 right-1 rounded px-2 py-1 text-left text-xs overflow-hidden bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 pointer-events-auto"
                      style={{
                        top: `${ev.topPct}%`,
                        height: `${ev.heightPct}%`,
                        minHeight: "24px",
                      }}
                    >
                      <span className="font-medium truncate block">{ev.title}</span>
                      <span className="text-[10px] opacity-80 truncate block">
                        {format(parseISO(ev.start), "h:mm a")} – {format(parseISO(ev.end), "h:mm a")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Click a time slot to add an event. Click an event to edit.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit event" : "New event"}</DialogTitle>
            <DialogDescription>Add or edit a schedule event for {projectName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Meeting, deadline..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-start">Start</Label>
                <Input
                  id="event-start"
                  type={formAllDay ? "date" : "datetime-local"}
                  value={formAllDay ? formStart.slice(0, 10) : formStart}
                  onChange={(e) => setFormStart(formAllDay ? e.target.value + "T00:00:00" : e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end">End</Label>
                <Input
                  id="event-end"
                  type={formAllDay ? "date" : "datetime-local"}
                  value={formAllDay ? formEnd.slice(0, 10) : formEnd}
                  onChange={(e) => setFormEnd(formAllDay ? e.target.value + "T23:59:59" : e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="allday" checked={formAllDay} onCheckedChange={(v) => setFormAllDay(!!v)} />
              <Label htmlFor="allday" className="text-sm font-normal">All day</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ismeeting" checked={formIsMeeting} onCheckedChange={(v) => setFormIsMeeting(!!v)} />
              <Label htmlFor="ismeeting" className="text-sm font-normal">This is a meeting</Label>
            </div>
            {formIsMeeting && (
              <div className="space-y-2">
                <Label htmlFor="meeting-link">Meeting link</Label>
                <Input
                  id="meeting-link"
                  type="url"
                  value={formMeetingLink}
                  onChange={(e) => setFormMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/... or Google Meet link"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="event-desc">Description (optional)</Label>
              <Textarea
                id="event-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            {editingEvent && (
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {editingEvent ? "Update" : "Add"} event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
