import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../utils/constants"
import type { RootState } from "../store"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  // prepareHeaders: (headers, { getState }) => {
  //   const token =
  //     (getState() as RootState).auth.token || localStorage.getItem("token")

  //   if (token && token !== null) {
  //     headers.set("authorization", `Bearer ${token}`)
  //   }

  //   return headers
  // },
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
})
