import React from "react"
import { useParams } from "react-router-dom"

import {
  useGetUserByIdQuery,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} from "../../app/services/userApi"
import { resetUser, selectCurrent } from "../../features/user/userSlice"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../../app/services/followApi"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { BASE_URL } from "../../utils/constants"
import { isErrorWithMsg } from "../../utils/is-error-with-msg"
import { formatToClientDate } from "../../utils/format-to-client-date"

import { CountInfo } from "../../components/count-info"
import { ButtonBack } from "../../components/button-back"
import { ProfileInfo } from "../../components/profile-info"
import { ProfileEdit } from "../../components/profile-edit"

import { Button, Card, Image, useDisclosure } from "@nextui-org/react"
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from "react-icons/md"
import { CiEdit } from "react-icons/ci"

export const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useGetUserByIdQuery(id ?? "")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [msg, setMsg] = React.useState("")
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerCurrent] = useLazyCurrentQuery()
  const [triggerGetUserById] = useLazyGetUserByIdQuery()

  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrent)

  React.useEffect(() => {
    dispatch(resetUser())
  }, [])

  const handleFollow = async () => {
    try {
      if (id) {
        data?.isFollowing
          ? await unfollowUser(id).unwrap()
          : await followUser({ followingId: id }).unwrap()

        await triggerGetUserById(id)

        await triggerCurrent()
      }
    } catch (error) {
      if (isErrorWithMsg(error)) {
        setMsg(error.data.msg)
      } else {
        setMsg(error as string)
      }
    }
  }

  const handleClose = async () => {
    try {
      if (id) {
        await triggerGetUserById(id)
        await triggerCurrent()
        onClose()
      }
    } catch (error) {
      if (isErrorWithMsg(error)) {
        setMsg(error.data.msg)
      } else {
        setMsg(error as string)
      }
    }
  }

  if (!data) {
    return null
  }

  return (
    <>
      <ButtonBack />
      <div className="flex gap-4">
        <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
          <Image
            src={`${BASE_URL}/${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className="border-4 border-white"
          />

          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}

            {currentUser?.id !== id ? (
              <Button
                color={data.isFollowing ? "default" : "primary"}
                variant="flat"
                className="gap-2"
                onClick={handleFollow}
                endContent={
                  data.isFollowing ? (
                    <MdOutlinePersonAddDisabled />
                  ) : (
                    <MdOutlinePersonAddAlt1 />
                  )
                }
              >
                {data.isFollowing ? "Відписатися" : "Підписатися"}
              </Button>
            ) : (
              <Button endContent={<CiEdit />} onClick={() => onOpen()}>
                Редагувати
              </Button>
            )}
          </div>
        </Card>

        <Card className="flex flex-col space-y-4 p-5 flex-1">
          <ProfileInfo title="Пошта" info={data.email}></ProfileInfo>

          <ProfileInfo
            title="Місце розташування"
            info={data.location}
          ></ProfileInfo>

          <ProfileInfo
            title="Дата народження"
            info={formatToClientDate(data.dateOfBirth)}
          ></ProfileInfo>

          <ProfileInfo title="Про мене" info={data.bio}></ProfileInfo>

          <div className="flex gap-2">
            <CountInfo title="Підписники" count={data.followers.length} />
            <CountInfo title="Підписки" count={data.following.length} />
          </div>
        </Card>
      </div>

      <ProfileEdit isOpen={isOpen} onClose={handleClose} user={data} />
    </>
  )
}
