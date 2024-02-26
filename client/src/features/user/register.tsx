import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import {
  useLazyCurrentQuery,
  useRegisterMutation,
} from "../../app/services/userApi"

import { Input } from "../../components/input"
import { Button, Link } from "@nextui-org/react"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"
import { MsgResponse } from "../../components/msg-response"

type RegisterType = {
  name: string
  email: string
  password: string
}

type Props = {
  setSelected: (value: string) => void
}

export const Register: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const [msg, setMsg] = React.useState("")

  const onSubmit = async (data: RegisterType) => {
    try {
      await register(data).unwrap()
      setSelected("login")
    } catch (error) {
      if (isErrorWithMsg(error)) {
        setMsg(error.data.msg)
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        control={control}
        name="name"
        label="Ім'я"
        type="text"
        required="Обов'язкове поле"
      />

      <Input
        control={control}
        name="email"
        label="Email"
        type="email"
        required="Обов'язкове поле"
      />

      <Input
        control={control}
        name="password"
        label="Пароль"
        type="password"
        required="Обов'язкове поле"
      />

      <MsgResponse msg={msg} />

      <p className="text-center text-small">
        Вже є акаунт?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("login")}
        >
          Увійти
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Зареєструватися
        </Button>
      </div>
    </form>
  )
}
