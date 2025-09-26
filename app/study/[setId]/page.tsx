"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { StudySession } from "@/lib/types"
import { StudyQueue } from "@/components/study-queue"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, BookOpen } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { UserSetup } from "@/components/user-setup"
import { UserHeader } from "@/components/user-header"
import Link from "next/link"

export default function StudyPage() {
  const params = useParams()
  const setId = params.setId as string
  const { user } = useUser()
  const [session, setSession] = useState<StudySession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/sets/${setId}/session`)

        if (!response.ok) {
          throw new Error("Failed to fetch study session")
        }

        const data = await response.json()
        setSession(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (setId && user) {
      fetchSession()
    }
  }, [setId, user])

  if (!user) {
    return <UserSetup />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </Link>
                <img src="/logo.png" alt="nowcards" className="h-8 w-auto" />
              </div>
              <UserHeader />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando sessão de estudo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </Link>
                <img src="/logo.png" alt="nowcards" className="h-8 w-auto" />
              </div>
              <UserHeader />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center p-4 py-20">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">Erro</h2>
              <p className="text-muted-foreground">{error || "Não foi possível carregar a sessão de estudo."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <img src="/logo.png" alt="nowcards" className="h-8 w-auto" />
              {session && <span className="text-sm text-muted-foreground">• {session.questions.length} questões</span>}
            </div>
            <UserHeader />
          </div>
        </div>
      </header>

      <div className="py-8 px-4">
        <StudyQueue questions={session.questions} setId={setId} userId={user.id} />
      </div>
    </div>
  )
}
