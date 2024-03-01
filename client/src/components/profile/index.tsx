import type React from "react"
import { Link } from "react-router-dom"

import { useAppSelector } from "../../app/hooks"
import { selectCurrent } from "../../features/user/userSlice"

import { BASE_URL } from "../../utils/constants"

import { MdAlternateEmail } from "react-icons/md"
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react"

export const Profile: React.FC = () => {
  const current = useAppSelector(selectCurrent)

  if (!current) {
    return null
  }

  const { id, name, email, avatarUrl } = current

  return (
    <Card className="py-4 w-[302px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <Image
          alt="Card profile"
          className="object-cover rounded-xl"
          src={`${BASE_URL}/${avatarUrl}`}
          width={370}
        />
      </CardHeader>

      <CardBody>
        <Link to={`/users/${id}`}>
          <h4 className="font-bold text-large mb-2">{name}</h4>
        </Link>

        <p className="text-default-500 flex items-center gap-2">
          <MdAlternateEmail />
          {email}
        </p>
      </CardBody>
    </Card>
  )
}
