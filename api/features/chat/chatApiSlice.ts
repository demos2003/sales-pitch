import { apiSlice } from "@/api/apiSlice"
import { ChatHistoryResponse, GenerateRoomRequest, GenerateRoomResponse, ChatRoom, SendMessageRequest } from "@/types/chat"

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatHistoryResponse, { projectId: string; roomId: string }>({
      query: ({ projectId, roomId }) => `/api/chat/history/${projectId}/${roomId}`,
      providesTags: (result, error, { roomId }) => [{ type: 'ChatHistory', id: roomId }],
    }),

    getMyChats: builder.query<ChatRoom[], void>({
      query: () => '/chat/my-chats',
      providesTags: ['ChatRooms'],
    }),

    getGroupChats: builder.query<any[], void>({
      query: () => '/chat/group-chats',
      providesTags: ['ChatRooms'],
    }),

    generateRoom: builder.mutation<GenerateRoomResponse, GenerateRoomRequest>({
      query: (data) => ({
        url: '/chat/generate-room',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ChatRooms'],
    }),

    sendMessage: builder.mutation<any, SendMessageRequest>({
      query: (data) => ({
        url: '/chat/send-message',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'ChatHistory', id: roomId },
        'ChatRooms'
      ],
    }),

    // Upload file to chat
    uploadFile: builder.mutation<any, { roomId: string; file: File } & Record<string, any>>({
      query: ({ roomId, file, ...rest }) => {
        const formData = new FormData()
        formData.append('roomId', roomId)
        formData.append('file', file)
        Object.entries(rest).forEach(([k, v]) => formData.append(k, String(v)))
        return {
          url: '/chat/upload-file',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'ChatHistory', id: roomId }
      ],
    }),

    // Create poll in chat
    createPoll: builder.mutation<any, { roomId: string; question: string; options: string[]; allowMultiple?: boolean; isAnonymous?: boolean } & Record<string, any>>({
      query: (body) => ({
        url: '/chat/create-poll',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'ChatHistory', id: roomId }
      ],
    }),

    // Vote on poll
    votePoll: builder.mutation<any, { roomId: string; optionId: string } & Record<string, any>>({
      query: (body) => ({
        url: '/chat/vote-poll',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: 'ChatHistory', id: roomId }
      ],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetChatHistoryQuery,
  useGetMyChatsQuery,
  useGetGroupChatsQuery,
  useGenerateRoomMutation,
  useSendMessageMutation,
  useUploadFileMutation,
  useCreatePollMutation,
  useVotePollMutation,
} = chatApiSlice