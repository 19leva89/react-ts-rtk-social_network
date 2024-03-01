import { Link } from "react-router-dom"

import { useAppSelector } from "../../app/hooks"
import { selectCurrent } from "../../features/user/userSlice"

import { User } from "../../components/user"

import { Card, CardBody } from "@nextui-org/react"

export const FollowingPage = () => {
  const currentUser = useAppSelector(selectCurrent)

  if (!currentUser) {
    return null
  }

  return currentUser.following.length > 0 ? (
    <div className="gap-5 flex flex-col">
      {currentUser.following.map(user => (
        <Link to={`/users/${user.following.id}`} key={user.following.id}>
          <Card>
            <CardBody className="block">
              <User
                name={user.following.name ?? ""}
                avatarUrl={user.following.avatarUrl ?? ""}
                description={user.following.email ?? ""}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <h1>У вас немає підписок</h1>
  )
}
