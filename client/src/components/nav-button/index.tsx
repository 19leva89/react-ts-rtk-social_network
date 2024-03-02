import type React from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../button"

type Props = {
  children: React.ReactNode
  icon: JSX.Element
  href: string
}

export const NavButton: React.FC<Props> = ({ children, icon, href }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(href)
  }

  return (
    <Button
      className="flex justify-start text-x1"
      icon={icon}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
