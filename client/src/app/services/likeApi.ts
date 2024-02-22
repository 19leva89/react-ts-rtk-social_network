import { api } from "./api"
import type { Like } from "../types"

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    likePost: builder.mutation<Like, { postId: string }>({
      query: body => ({
        url: "/likes",
        method: "POST",
        body,
      }),
    }),

    unlikePost: builder.mutation<void, string>({
      query: postId => ({
        url: `/unlikes/${postId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useLikePostMutation, useUnlikePostMutation } = likeApi

export const {
  endpoints: { likePost, unlikePost },
} = likeApi
