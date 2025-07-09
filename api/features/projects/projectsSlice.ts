import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "@/api/apiSlice";

interface ProjectsState {
  selectedProject: any | null;
}

const initialState: ProjectsState = {
  selectedProject: null,
};

const projectsStateSlice = createSlice({
  name: "projectsState",
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<any>) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setSelectedProject } = projectsStateSlice.actions;
export const projectsStateReducer = projectsStateSlice.reducer;

export const projectsSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getAllProjects: builder.query<any, void>({
            query: () => "/projects/",
            providesTags: ['Project'], // Tag this query
        }),
        getProjectById: builder.query<any, string>({
            query: (id) => `/projects/${id}`,
            providesTags: (result, error, id) => [{ type: 'Project', id }], // Tag individual project
        }),
        createProject: builder.mutation<any, any>({
            query: (projectData) => ({
                url: "/projects/",
                method: "POST",
                body: projectData,
            }),
            invalidatesTags: ['Project'], // Invalidate all project queries
        }),
        updateProject: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/projects/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Project', id }, // Invalidate specific project
                'Project' // Invalidate all projects list
            ],
        }),
        deleteProject: builder.mutation<any, string>({
            query: (id) => ({
                url: `/projects/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Project'], // Invalidate all project queries
        }),
    }),
});

export const {
    useGetAllProjectsQuery,
    useGetProjectByIdQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectsSlice;