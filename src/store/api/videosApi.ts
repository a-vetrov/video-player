import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type VideosResponse = {
  files: string[]
}

export const videosApi = createApi({
  reducerPath: 'videosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    getVideos: builder.query<VideosResponse, void>({
      query: () => '/api/videos',
    }),
  }),
})

export const { useGetVideosQuery } = videosApi
