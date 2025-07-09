import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import backendUrl from "./config";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ['ApplicationStatus', 'MyApplications', 'Project'], // Add 'Project' here
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl.hostedURL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProjects: builder.query<any[], void>({
      query: () => "/projects",
      providesTags: ['Project'], // Add this to tag the query
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Project'], // Add this to invalidate on create
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation
} = apiSlice;