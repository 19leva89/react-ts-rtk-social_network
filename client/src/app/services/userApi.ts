import { api } from "./api"
import type { User } from "../types"

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: body => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<
      { email: string; password: string; name: string },
      { email: string; password: string; name: string }
    >({
      query: body => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    current: builder.query<User, void>({
      query: () => ({
        url: "/current",
        method: "GET",
      }),
    }),

    getUserById: builder.query<User, string>({
      query: id => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation<User, { userData: FormData; id: string }>({
      query: ({ userData, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useCurrentQuery,
  useLazyCurrentQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi

export const {
  endpoints: { login, register, current, getUserById, updateUser },
} = userApi
