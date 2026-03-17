import { apiSlice } from "@/api/apiSlice"

export interface WorkspaceScheduleEvent {
  _id?: string
  id?: string
  projectId: string
  title: string
  start: string // ISO date-time
  end: string
  allDay?: boolean
  description?: string
  /** When true, event is a meeting and may have meetingLink */
  isMeeting?: boolean
  /** Video/call link (Zoom, Meet, etc.) for meetings */
  meetingLink?: string
  createdAt?: string
  updatedAt?: string
}

export const workspaceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceSchedule: builder.query<WorkspaceScheduleEvent[], string>({
      query: (projectId) => `/workspace/${projectId}/schedule`,
      providesTags: (result, error, projectId) => [{ type: "Project", id: `schedule-${projectId}` }],
    }),

    createScheduleEvent: builder.mutation<
      WorkspaceScheduleEvent,
      { projectId: string; event: Omit<WorkspaceScheduleEvent, "projectId" | "_id" | "id" | "createdAt" | "updatedAt"> }
    >({
      query: ({ projectId, event }) => ({
        url: `/workspace/${projectId}/schedule`,
        method: "POST",
        body: event,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Project", id: `schedule-${projectId}` }],
    }),

    updateScheduleEvent: builder.mutation<
      WorkspaceScheduleEvent,
      { projectId: string; eventId: string; event: Partial<Pick<WorkspaceScheduleEvent, "title" | "start" | "end" | "allDay" | "description" | "isMeeting" | "meetingLink">> }
    >({
      query: ({ projectId, eventId, event }) => ({
        url: `/workspace/${projectId}/schedule/${eventId}`,
        method: "PATCH",
        body: event,
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Project", id: `schedule-${projectId}` }],
    }),

    deleteScheduleEvent: builder.mutation<void, { projectId: string; eventId: string }>({
      query: ({ projectId, eventId }) => ({
        url: `/workspace/${projectId}/schedule/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [{ type: "Project", id: `schedule-${projectId}` }],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetWorkspaceScheduleQuery,
  useCreateScheduleEventMutation,
  useUpdateScheduleEventMutation,
  useDeleteScheduleEventMutation,
} = workspaceApiSlice
