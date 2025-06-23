
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

const themes = ["glass", "light", "dark"]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "glass"
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(...themes.map(t => `theme-${t}`))
    root.classList.add(`theme-${theme}`)
    localStorage.setItem("theme", theme)
  }, [theme])

  const cycleTheme = () => {
    const next = (themes.indexOf(theme) + 1) % themes.length
    setTheme(themes[next])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
