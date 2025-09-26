"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  avatar: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("studycards-user")
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("studycards-user")
      }
    }
  }, [])

  const setUser = (newUser: User) => {
    setUserState(newUser)
    localStorage.setItem("studycards-user", JSON.stringify(newUser))
  }

  const clearUser = () => {
    setUserState(null)
    localStorage.removeItem("studycards-user")
  }

  return <UserContext.Provider value={{ user, setUser, clearUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
