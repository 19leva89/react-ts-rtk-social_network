import React from "react"
import { Controller, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"

import type { User } from "../../app/types"
import { useUpdateUserMutation } from "../../app/services/userApi"

import { Input } from "../input"
import { ThemeContext } from "../theme"
import { MsgResponse } from "../msg-response"

import { MdOutlineEmail } from "react-icons/md"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"

type Props = {
  isOpen: boolean
  onClose: () => void
  user?: User
}

export const ProfileEdit: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { id } = useParams<{ id: string }>()
  const { theme } = React.useContext(ThemeContext)
  const [msg, setMsg] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const { handleSubmit, control } = useForm<User>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      email: user?.email,
      name: user?.email,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()

        data.name && formData.append("name", data.name)

        data.email &&
          data.email !== user?.email &&
          formData.append("email", data.email)

        data.dateOfBirth &&
          formData.append(
            "dateOfBirth",
            new Date(data.dateOfBirth).toISOString(),
          )

        data.bio && formData.append("bio", data.bio)

        data.location && formData.append("location", data.location)

        selectedFile && formData.append("avatar", selectedFile)
        console.log("selectedFile:", selectedFile)

        await updateUser({ userData: formData, id }).unwrap()

        onClose()
      } catch (error) {
        if (isErrorWithMsg(error)) {
          setMsg(error.data.msg)
        } else {
          setMsg(error as string)
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`${theme} text-foreground`}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Зміна профілю
            </ModalHeader>

            <ModalBody>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  endContent={<MdOutlineEmail />}
                />

                <Input control={control} name="name" label="Ім'я" type="text" />

                <input
                  name="avatarUrl"
                  type="file"
                  placeholder="Оберіть файл"
                  onChange={handleFileChange}
                />

                <Input
                  control={control}
                  name="dateOfBirth"
                  label="Дата народження"
                  type="date"
                  placeholder="Мій день народження"
                />

                <Controller
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Ваша біографія"
                    />
                  )}
                />

                <Input
                  control={control}
                  name="location"
                  label="Місце розташування"
                  type="text"
                />

                <MsgResponse msg={msg} />

                <div className="flex gap-2 justify-end">
                  <Button
                    fullWidth
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Оновити профіль
                  </Button>
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              {/* <Button color="danger" variant="light" onPress={onClose}>
                Закрити
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
