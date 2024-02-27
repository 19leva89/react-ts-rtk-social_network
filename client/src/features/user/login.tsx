import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import {
  useLazyCurrentQuery,
  useLoginMutation,
} from "../../app/services/userApi"

import { Input } from "../../components/input"
import { Button, Link } from "@nextui-org/react"
import { MsgResponse } from "../../components/msg-response"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"

type LoginType = {
  email: string
  password: string
}

type Props = {
  setSelected: (value: string) => void
}

export const Login: React.FC<Props> = ({ setSelected }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginType>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const navigate = useNavigate()
  const [msg, setMsg] = React.useState("")
  const [login, { isLoading }] = useLoginMutation()
  const [triggerCurrent] = useLazyCurrentQuery()

  const onSubmit = async (data: LoginType) => {
    try {
      await login(data).unwrap()
      await triggerCurrent().unwrap()
      navigate("/")
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

      {errors && <MsgResponse msg={msg} />}

      <p className="text-center text-small">
        Немає акаунту?{" "}
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected("sign-up")}
        >
          Зареєструйтеся
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Увійти
        </Button>
      </div>
    </form>
  )
}
