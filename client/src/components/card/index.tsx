import React from "react"
import { Link, useNavigate } from "react-router-dom"

import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../../app/services/likeApi"
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from "../../app/services/postApi"
import { useAppSelector } from "../../app/hooks"
import { selectCurrent } from "../../features/user/userSlice"
import { useDeleteCommentMutation } from "../../app/services/commentApi"

import { User } from "../user"
import { MetaInfo } from "../meta-info"
import { Typography } from "../typography"
import { formatToClientDate } from "../../utils/format-to-client-date"

import { RiDeleteBinLine } from "react-icons/ri"
import {
  CardBody,
  CardFooter,
  CardHeader,
  Card as NextCard,
  Spinner,
} from "@nextui-org/react"
import { FcDislike } from "react-icons/fc"
import { FaRegComment } from "react-icons/fa"
import { MdOutlineFavoriteBorder } from "react-icons/md"
import { MsgResponse } from "../msg-response"

type Props = {
  id?: string
  name: string
  avatarUrl: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  cardFor: "comment" | "post" | "current-post"
  likedByUser?: boolean
}

export const Card: React.FC<Props> = ({
  id = "",
  name = "",
  avatarUrl = "",
  authorId = "",
  content = "",
  commentId = "",
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  cardFor = "post",
  likedByUser = false,
}) => {
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [msg, setMsg] = React.useState("")
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectCurrent)

  return (
    <NextCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-non text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>

        {authorId === currentUser?.id && (
          <div className="cursor-pointer">
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
              <Spinner />
            ) : (
              <RiDeleteBinLine />
            )}
          </div>
        )}
      </CardHeader>

      <CardBody className="px-3 py-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>

      {cardFor !== "comment" && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div>
              <MetaInfo
                count={likesCount}
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
              />
            </div>

            <Link to={`/posts/${id}`}>
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            </Link>
          </div>

          <MsgResponse msg={msg} />
        </CardFooter>
      )}
    </NextCard>
  )
}
