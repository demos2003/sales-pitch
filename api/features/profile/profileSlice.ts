import { apiSlice } from "@/api/apiSlice";

export interface ProfileLinks {
  website?: string;
  github?: string;
  linkedin?: string;
}

export interface ProfileData {
  fullName?: string;
  email?: string;
  location?: string;
  bio?: string;
  professionalTitle?: string;
  links?: ProfileLinks;
  skills?: string[];
}

export interface SkillsResponse {
  skills: string[];
  isEmpty: boolean;
}

export const profileSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/users/me
    getMyProfile: builder.query<ProfileData, void>({
      query: () => "/users/me",
    
    }),

    // ✅ PUT /api/users/me
    updateMyProfile: builder.mutation<ProfileData, Partial<ProfileData>>({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
    }),

    // ✅ GET /api/users/me/skills/check
    checkSkills: builder.query<SkillsResponse, void>({
      query: () => "/users/me/skills/check",
      providesTags: ['Skills']
    }),

    // ✅ POST /api/users/me/skills
    updateSkills: builder.mutation<void, { skills: string[] }>({
      query: (data) => ({
        url: "/users/me/skills",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Skills']
    }),
  }),
  overrideExisting: true
});

export const { 
  useGetMyProfileQuery, 
  useUpdateMyProfileMutation,
  useCheckSkillsQuery,
  useUpdateSkillsMutation 
} = profileSlice;
