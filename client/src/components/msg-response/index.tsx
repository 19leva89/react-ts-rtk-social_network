import type React from "react"

type Props = {
  msg?: string
}

export const MsgResponse: React.FC<Props> = ({ msg }) => {
  return msg && <p className="text-red-500 mt-2 mb-5 text-small">{msg}</p>
}
