'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export function LogoutButton({ 
  variant = 'outline', 
  size = 'default', 
  className = '',
  showText = true 
}: LogoutButtonProps) {
  const { user, token, clearUser } = useUser()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('Logout realizado com sucesso!')
      } else {
        toast.error('Erro ao fazer logout, mas você foi desconectado')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Erro de conexão, mas você foi desconectado')
    } finally {
      // Clear user data regardless of API call result
      clearUser()
      router.push('/')
      router.refresh()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </span>
      )}
    </Button>
  )
}
