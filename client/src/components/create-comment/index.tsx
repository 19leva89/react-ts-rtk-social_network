import React from "react"
import { useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"

import { useLazyGetPostByIdQuery } from "../../app/services/postApi"
import { useCreateCommentMutation } from "../../app/services/commentApi"

import { MsgResponse } from "../msg-response"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"

import { IoMdCreate } from "react-icons/io"
import { Button, Textarea } from "@nextui-org/react"

export const CreateComment: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [msg, setMsg] = React.useState("")
  const [createComment, { isLoading }] = useCreateCommentMutation()
  const [getPostById] = useLazyGetPostByIdQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await createComment({ content: data.comment, postId: id }).unwrap()
        setValue("comment", "")
        await getPostById(id).unwrap()
      }
    } catch (error) {
      if (isErrorWithMsg(error)) {
        setMsg(error.data.msg)
      } else {
        setMsg(error as string)
      }
    }
  })

  // const msg = errors?.post?.message as string

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{ required: "Обов'язкове поле" }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Напишіть свій коментар"
            className="mb-5"
          />
        )}
      />

      {errors && <MsgResponse msg={msg} />}

      <Button
        color="primary"
        type="submit"
        isLoading={isLoading}
        endContent={<IoMdCreate />}
        className="flex-end"
      >
        Відповісти
      </Button>
    </form>
  )
}
