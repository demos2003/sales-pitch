import { apiSlice } from "@/api/apiSlice";

export interface DashboardStats {
  activeProjects: number;
  applications: number;
  messages: number;
  pca?: number;
  ds?: number;
}

export const notificationsSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all notifications for the current user
    getNotifications: builder.query<any[], void>({
      query: () => '/notifications',
    //   providesTags: ['Notifications'],
    }),
    
    // Get dashboard statistics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard',
      // Cache the dashboard stats for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetDashboardStatsQuery,
} = notificationsSlice;
