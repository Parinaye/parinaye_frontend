import { createContext, useContext, useEffect, useState } from "react"
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { setProfileTheme} from "../../redux/profile/profileSlice.js"

type Theme = "dark" | "light" | "system"
 
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}
 
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}
 
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}
 
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
 
export function ThemeProvider({
  children,
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  

  const dispatch = useDispatch();
  const { profileTheme } = useSelector((state: any) => state.profile);

  useEffect(() => {
    const root = window.document.documentElement
 
    root.classList.remove("light", "dark")
 
    if (profileTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
 
      root.classList.add(systemTheme)
      return
    }
 
    root.classList.add(profileTheme)
    dispatch(setProfileTheme(profileTheme))
  }, [profileTheme])
 
  const value = {
    theme: profileTheme,
    setTheme: (profileTheme: Theme) => {
      // localStorage.setItem(storageKey, theme)
      dispatch(setProfileTheme(profileTheme))
    },
  }
 
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
 
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
 
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
 
  return context
}