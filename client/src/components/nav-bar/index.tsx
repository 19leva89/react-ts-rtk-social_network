import type React from "react"
import { NavButton } from "../nav-button"
import { BsPostcard } from "react-icons/bs"
import { FiUsers } from "react-icons/fi"
import { FaUsers } from "react-icons/fa"

export const NavBar: React.FC = () => {
  return (
    <nav>
      <ul className="flex flex-col gap-5">
        <li>
          <NavButton icon={<BsPostcard />} href="/">
            Пости
          </NavButton>
        </li>

        <li>
          <NavButton icon={<FiUsers />} href="following">
            Підписки
          </NavButton>
        </li>

        <li>
          <NavButton icon={<FaUsers />} href="followers">
            Підписники
          </NavButton>
        </li>
      </ul>
    </nav>
  )
}
