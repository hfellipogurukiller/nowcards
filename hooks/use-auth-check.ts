'use client'

import { useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { toast } from 'sonner'

export function useAuthCheck() {
  const { user, token, clearUser } = useUser()

  useEffect(() => {
    if (!user || !token) return

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired
        toast.error('Sua sessão expirou. Faça login novamente.')
        clearUser()
        return
      }
    } catch (error) {
      // Invalid token format
      console.error('Invalid token format:', error)
      toast.error('Token inválido. Faça login novamente.')
      clearUser()
      return
    }

    // Set up periodic token validation
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          // Token is invalid or expired
          toast.error('Sua sessão expirou. Faça login novamente.')
          clearUser()
        }
      } catch (error) {
        console.error('Token validation error:', error)
        // Don't clear user on network errors, only on auth errors
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [user, token, clearUser])
}
