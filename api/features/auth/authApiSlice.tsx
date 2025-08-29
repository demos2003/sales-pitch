import { apiSlice } from "@/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),

    signUp: builder.mutation({
      query: ({ name, email, password, role, primaryRole }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password, role, primaryRole },
      }),
    }),

    toggle2fa: builder.mutation({
      query: () => ({
        url: "/auth/toggle-2fa",
        method: "POST",
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-2faotp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    getCurrentUser: builder.query<any, void>({ // 👈 return type, argument type
      query: () => "/users/me",
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

  }),
  overrideExisting: true,
})

export const {
  useLoginMutation,
  useSignUpMutation,
  useToggle2faMutation,
  useVerifyOtpMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation
} = authApiSlice
