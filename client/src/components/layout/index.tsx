import React from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../app/hooks"
import {
  selectIsAuthenticated,
  selectUser,
} from "../../features/user/userSlice"

import { Header } from "../header"
import { Container } from "../container"
import { NavBar } from "../nav-bar"
import { Profile } from "../profile"

export const Layout: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth")
    }
  }, [])

  return (
    <>
      <Header />

      <Container>
        <div className="flex-2 p-4">
          <NavBar />
        </div>

        <div className="flex-1 p-4">
          <Outlet />
        </div>

        <div className="flex-2 p-4">
          <div className="flex-col flex gap-5">{!user && <Profile />}</div>
        </div>
      </Container>
    </>
  )
}
