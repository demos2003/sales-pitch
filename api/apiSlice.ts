import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import backendUrl from "./config";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl.hostedURL, // adjust as needed
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
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "/projects",
        method: "POST",
        body: data,
      }),
    }),
    // Add more like login, applyToProject, rateUser, etc.
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = apiSlice;
