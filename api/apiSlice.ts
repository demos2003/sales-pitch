import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import backendUrl from "./config";
import { logout } from "./features/auth/authSlice";
import { isTokenExpired } from "@/utils/auth";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: backendUrl.baseURL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        // Token is expired, remove it and don't add to headers
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return headers;
      }
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);
  
  // Handle 401 Unauthorized responses (token expired)
  if (result.error && result.error.status === 401) {
    // Dispatch logout action
    api.dispatch(logout());
    
    // Redirect to auth page (you might want to handle this differently)
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ['ApplicationStatus', 'MyApplications', 'Project', 'ChatHistory', 'ChatRooms', 'Skills'], // Add chat and skills tag types
  baseQuery: baseQueryWithReauth,
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