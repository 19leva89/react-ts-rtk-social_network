import type React from "react"
import { Button as NextButton } from "@nextui-org/react"

type Props = {
  children: React.ReactNode
  className?: string
  icon?: JSX.Element
  type?: "button" | "submit" | "reset"
  fullWidth?: boolean
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined
  onClick?: () => void
}

export const Button: React.FC<Props> = ({
  children,
  className,
  icon,
  type,
  fullWidth,
  color,
  onClick,
}) => {
  return (
    <NextButton
      startContent={icon}
      size="lg"
      color={color}
      variant="light"
      className={className}
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </NextButton>
  )
}
