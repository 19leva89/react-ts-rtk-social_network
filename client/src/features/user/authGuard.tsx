import type React from "react"

import { useCurrentQuery } from "../../app/services/userApi"
import { Spinner } from "@nextui-org/react"

type Props = {
  children: JSX.Element
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { isLoading } = useCurrentQuery()

  if (isLoading) {
    return <Spinner />
  }

  return children
}
