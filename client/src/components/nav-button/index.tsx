import type React from "react"

import { Button } from "../button"
import { Link } from "react-router-dom"

type Props = {
  children: React.ReactNode
  icon: JSX.Element
  href: string
}

export const NavButton: React.FC<Props> = ({ children, icon, href }) => {
  return (
    <Button className="flex justify-start text-x1" icon={icon}>
      <Link to={href}>{children}</Link>
    </Button>
  )
}
