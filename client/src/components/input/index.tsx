import type React from "react"
import { useController, type Control } from "react-hook-form"

import { Input as NextInput } from "@nextui-org/react"

type Props = {
  name: string
  label: string
  type?: string
  placeholder?: string
  control: Control<any>
  required?: string
  endContent?: JSX.Element
}

export const Input: React.FC<Props> = ({
  name,
  label,
  type,
  placeholder,
  control,
  required = "",
  endContent,
}) => {
  const {
    field,
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: { required },
  })

  return (
    <NextInput
      id={name}
      label={label}
      type={type}
      placeholder={placeholder}
      value={field.value}
      name={field.name}
      isInvalid={invalid}
      onChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={`${errors[name]?.message ?? ""}`}
    ></NextInput>
  )
}
