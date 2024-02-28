import React from "react"
import { Controller, useForm } from "react-hook-form"

import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from "../../app/services/postApi"

import { MsgResponse } from "../msg-response"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"

import { IoMdCreate } from "react-icons/io"
import { Button, Textarea } from "@nextui-org/react"

export const CreatePost: React.FC = () => {
  const [msg, setMsg] = React.useState("")
  const [createPost, { isLoading }] = useCreatePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    try {
      await createPost({ content: data.post }).unwrap()
      setValue("post", "")
      await triggerGetAllPosts().unwrap()
    } catch (error) {
      if (isErrorWithMsg(error)) {
        setMsg(error.data.msg)
      }
    }
  })

  // const msg = errors?.post?.message as string

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="post"
        control={control}
        defaultValue=""
        rules={{ required: "Обов'язкове поле" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Про що думаєте?"
            className="mb-5"
          />
        )}
      />

      {errors && <MsgResponse msg={msg} />}

      <Button
        color="success"
        type="submit"
        isLoading={isLoading}
        endContent={<IoMdCreate />}
        className="flex-end"
      >
        Додати пост
      </Button>
    </form>
  )
}
