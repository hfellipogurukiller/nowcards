"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Loader2 } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UserHeader() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 h-auto p-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled>
          <User className="w-4 h-4 mr-2" />
          {user.name}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-destructive focus:text-destructive"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
