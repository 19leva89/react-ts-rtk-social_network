import React from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { useAppSelector } from "../../app/hooks"
import {
  selectIsAuthenticated,
  selectUser,
} from "../../features/user/userSlice"

import { Header } from "../header"
import { NavBar } from "../nav-bar"
import { Profile } from "../profile"
import { Container } from "../container"

export const Layout: React.FC = () => {
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

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
          <Outlet key={window.location.pathname} />
        </div>

        <div className="flex-2 p-4">
          <div className="flex-col flex gap-5">{!user ? <Profile /> : ""}</div>
        </div>
      </Container>
    </>
  )
}
