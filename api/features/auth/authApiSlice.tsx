import { apiSlice } from "@/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({email, password}) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    signUp: builder.mutation({
      query: ({ name, email, password, role, primaryRole }) => {
        return {
          url: "/auth/register",
          method: "POST",
          body: {
            name,
            email,
            password,
            role,
            primaryRole
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useSignUpMutation } =
  authApiSlice;