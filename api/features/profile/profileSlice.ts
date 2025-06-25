import { apiSlice } from "@/api/apiSlice";

export const profileSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/users/me
    getMyProfile: builder.query<any, void>({
      query: () => "/users/me",
      
    }),

    // ✅ PUT /api/users/me
    updateMyProfile: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
     
    }),
  }),
  overrideExisting:true
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = profileSlice;
