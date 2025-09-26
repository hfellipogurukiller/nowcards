"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserContextType {
  user: User | null
  token: string | null
  setUser: (user: User, token: string) => void
  clearUser: () => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")
    
    if (savedUser && savedToken) {
      try {
        setUserState(JSON.parse(savedUser))
        setTokenState(savedToken)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }
    
    setIsLoading(false)
  }, [])

  const setUser = (newUser: User, newToken: string) => {
    setUserState(newUser)
    setTokenState(newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem("token", newToken)
  }

  const clearUser = () => {
    setUserState(null)
    setTokenState(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return (
    <UserContext.Provider value={{ user, token, setUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
