import type React from "react"

import { BASE_URL } from "../../utils/constants"

import { User as NextUser } from "@nextui-org/react"

type Props = {
  name: string
  avatarUrl: string
  description?: string
  className?: string
}

export const User: React.FC<Props> = ({
  name = "",
  avatarUrl = "",
  description = "",
  className = "",
}) => {
  return (
    <NextUser
      name={name}
      className={className}
      description={description}
      avatarProps={{ src: `${BASE_URL}/${avatarUrl}` }}
    />
  )
}
