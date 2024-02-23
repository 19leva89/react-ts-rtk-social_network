import type { ErrorWithMsg } from "../app/types"

export const isErrorWithMsg = (error: unknown): error is ErrorWithMsg => {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, unknown>).data === "object" &&
    error.data !== null
  )
}
