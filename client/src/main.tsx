import React from "react"
import { Provider } from "react-redux"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import App from "./App"
import { store } from "./app/store"

import { Layout } from "./components/layout"
import { ThemeProvider } from "./components/theme"

import { AuthPage } from "./pages/auth"
import { PostsPage } from "./pages/posts"
import { FollowersPage } from "./pages/followers"
import { FollowingPage } from "./pages/following"
import { PostCurrentPage } from "./pages/post-current"
import { UserProfilePage } from "./pages/user-profile"

import { NextUIProvider } from "@nextui-org/react"
import "./index.css"

const container = document.getElementById("root")

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <PostsPage />,
      },
      {
        path: "posts/:id",
        element: <PostCurrentPage />,
      },
      {
        path: "users/:id",
        element: <UserProfilePage />,
      },
      {
        path: "followers",
        element: <FollowersPage />,
      },
      {
        path: "following",
        element: <FollowingPage />,
      },
    ],
  },
])

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <NextUIProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </NextUIProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
