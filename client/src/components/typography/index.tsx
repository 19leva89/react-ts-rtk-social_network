import type React from "react"

type Props = {
  size?: string
  children: string
}

export const Typography: React.FC<Props> = ({ size = "text-xl", children }) => {
  return <p className={`${size}`}>{children}</p>
}
