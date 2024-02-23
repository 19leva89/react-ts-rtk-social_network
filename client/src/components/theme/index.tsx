import React from "react"
import type { ReactNode } from "react"

type ThemeContextType = {
  theme: "dark" | "light"
  toggleTheme: () => void
}

type Props = {
  children: ReactNode
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => null,
})

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const storedTheme = localStorage.getItem("theme")
  const currentTheme = storedTheme ? (storedTheme as "dark" | "light") : "dark"

  const [theme, setTheme] = React.useState(currentTheme)

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)

      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <main className={`${theme} text-foreground bg-background`}>
        {children}
      </main>
    </ThemeContext.Provider>
  )
}
