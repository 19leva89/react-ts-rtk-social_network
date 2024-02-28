import React from "react"
import { useParams } from "react-router-dom"

import { useGetPostByIdQuery } from "../../app/services/postApi"

import { Card } from "../../components/card"
import { ButtonBack } from "../../components/button-back"
import { CreateComment } from "../../components/create-comment"

export const PostCurrentPage = () => {
  const params = useParams<{ id: string }>()
  const { data } = useGetPostByIdQuery(params?.id ?? "")

  if (!data) {
    return <h2>Посту не існує</h2>
  }

  const {
    id,
    content,
    author,
    authorId,
    likes,
    comments,
    likedByUser,
    createdAt,
  } = data

  return (
    <>
      <ButtonBack />

      <Card
        id={id}
        name={author.name ?? ""}
        avatarUrl={author.avatarUrl ?? ""}
        authorId={authorId}
        content={content}
        likesCount={likes.length}
        commentsCount={comments.length}
        createdAt={createdAt}
        cardFor="current-post"
        likedByUser={likedByUser}
      />

      <div className="mt-10">
        <CreateComment />
      </div>

      <div className="mt-10">
        {data.comments
          ? data.comments.map(comment => (
              <Card
                key={comment.id}
                id={id}
                name={comment.user.name ?? ""}
                avatarUrl={comment.user.avatarUrl ?? ""}
                authorId={comment.userId}
                commentId={comment.id}
                content={comment.content}
                cardFor="comment"
              />
            ))
          : null}
      </div>
    </>
  )
}
