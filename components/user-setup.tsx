"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, UserCheck } from "lucide-react"
import { useUser } from "@/lib/user-context"

const avatarOptions = [
  "👨‍🎓",
  "👩‍🎓",
  "🧑‍💻",
  "👨‍💻",
  "👩‍💻",
  "🧑‍🔬",
  "👨‍🔬",
  "👩‍🔬",
  "🧑‍🏫",
  "👨‍🏫",
  "👩‍🏫",
  "🧑‍⚕️",
  "👨‍⚕️",
  "👩‍⚕️",
  "🧑‍🎨",
  "👨‍🎨",
]

export function UserSetup() {
  const { setUser } = useUser()
  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    // Generate a unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newUser = {
      id: userId,
      name: name.trim(),
      avatar: selectedAvatar,
    }

    setUser(newUser)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao nowcards</CardTitle>
          <CardDescription>Configure seu perfil para começar a estudar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
              />
            </div>

            <div className="space-y-3">
              <Label>Escolha seu avatar</Label>
              <div className="grid grid-cols-8 gap-2">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg
                      transition-colors hover:bg-muted
                      ${selectedAvatar === avatar ? "border-primary bg-primary/10" : "border-border"}
                    `}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!name.trim() || isSubmitting}>
              <UserCheck className="w-4 h-4 mr-2" />
              {isSubmitting ? "Configurando..." : "Começar a Estudar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
