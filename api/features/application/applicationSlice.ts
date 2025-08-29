// src/api/applicationSlice.ts
import { apiSlice } from "@/api/apiSlice";

export const applicationSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Submit application mutation
    applyToProject: builder.mutation<any, { projectId: string; role: string; message?: string }>({
      query: ({ projectId, role, message }) => ({
        url: `/applications/project/${projectId}`,
        method: "POST",
        body: { role, message },
      }),
      invalidatesTags: ['ApplicationStatus'], // Invalidate tag after applying
    }),
    updateApplicationStatus: builder.mutation<any, { projectId: string; id: string; status: string }>({
      query: ({ projectId, id, status }) => ({
        url: `/applications/project/${projectId}/applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    // Check if user already applied
    checkApplicationStatus: builder.query<any, string>({
      query: (projectId) => `/applications/check/${projectId}`,
      providesTags: ['ApplicationStatus'], // Revalidate tag
    }),
    getMyApplications: builder.query<any[], void>({
      query: () => `/applications/me`,
      providesTags: ['MyApplications'],
    }),
    getApplicationsGroupedByProjectForFounder: builder.query<any[], void>({
      query: () => `/applications/founder/grouped`
    }),

    // Cancel application mutation
    cancelApplication: builder.mutation<any, string>({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['MyApplications', 'ApplicationStatus'], // Invalidate relevant tags
    }),

  }),
});

// Export hooks
export const {
  useApplyToProjectMutation,
  useCheckApplicationStatusQuery,
  useGetMyApplicationsQuery,
  useGetApplicationsGroupedByProjectForFounderQuery,
  useUpdateApplicationStatusMutation,
  useCancelApplicationMutation,
} = applicationSlice;
