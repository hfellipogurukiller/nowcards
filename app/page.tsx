"use client"

import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp, Play } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { UserSetup } from "@/components/user-setup"
import { UserHeader } from "@/components/user-header"

interface StudySet {
  id: string
  title: string
  description: string
  questionCount: number
}

export default function HomePage() {
  const { user, isLoading: userLoading } = useUser()
  const [sets, setSets] = useState<StudySet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSets() {
      try {
        const response = await fetch("/api/sets")
        const data = await response.json()
        setSets(data.sets || [])
      } catch (error) {
        console.error("Failed to fetch sets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSets()
  }, [])

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <img src="/nowcards-logo.png" alt="nowcards" className="h-8 w-auto" />
              </div>
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline">Entrar</Button>
                </Link>
                <Link href="/register">
                  <Button>Criar Conta</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4 text-balance">Estude com Cartões Inteligentes</h2>
            <p className="text-xl text-muted-foreground text-pretty mb-8">
              Sistema de aprendizado adaptativo com questões de múltipla escolha. Cada usuário tem sua própria sessão de
              estudo isolada.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Começar Agora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Multi-usuário</CardTitle>
                <CardDescription>Vários usuários podem estudar simultaneamente sem interferência</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-accent mb-2" />
                <CardTitle>Fila Inteligente</CardTitle>
                <CardDescription>Questões erradas retornam mais cedo, corretas vão para o final</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-success mb-2" />
                <CardTitle>Progresso Individual</CardTitle>
                <CardDescription>Acompanhe seu desempenho com estatísticas detalhadas</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-6 text-center">Como Usar</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Atalhos de Teclado</CardTitle>
                    <CardDescription>
                      <div className="space-y-2 mt-2">
                        <p>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Conferir resposta
                        </p>
                        <p>
                          <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> - Próxima questão
                        </p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sistema de Fila</CardTitle>
                    <CardDescription>
                      <div className="space-y-2 mt-2">
                        <p>
                          ✅ <strong>Acertou:</strong> Questão vai para o final
                        </p>
                        <p>
                          ❌ <strong>Errou:</strong> Questão volta após 2 posições
                        </p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <img src="/nowcards-logo.png" alt="nowcards" className="h-8 w-auto" />
            </div>
            <UserHeader />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Estude com Cartões Inteligentes</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Sistema de aprendizado adaptativo com questões de múltipla escolha. Cada usuário tem sua própria sessão de
            estudo isolada.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Multi-usuário</CardTitle>
              <CardDescription>Vários usuários podem estudar simultaneamente sem interferência</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Fila Inteligente</CardTitle>
              <CardDescription>Questões erradas retornam mais cedo, corretas vão para o final</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="w-8 h-8 text-success mb-2" />
              <CardTitle>Progresso Individual</CardTitle>
              <CardDescription>Acompanhe seu desempenho com estatísticas detalhadas</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Available Study Sets */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6">Conjuntos de Estudo Disponíveis</h3>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando conjuntos...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sets.map((set) => (
                <Card key={set.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{set.title}</CardTitle>
                        <CardDescription className="mt-1">{set.description}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">{set.questionCount} questões disponíveis</p>
                      </div>
                      <Link href={`/study/${set.id}`}>
                        <Button size="lg" className="gap-2">
                          <Play className="w-4 h-4" />
                          Começar Estudo
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">Como Usar</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atalhos de Teclado</CardTitle>
                  <CardDescription>
                    <div className="space-y-2 mt-2">
                      <p>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> - Conferir resposta
                      </p>
                      <p>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> - Próxima questão
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sistema de Fila</CardTitle>
                  <CardDescription>
                    <div className="space-y-2 mt-2">
                      <p>
                        ✅ <strong>Acertou:</strong> Questão vai para o final
                      </p>
                      <p>
                        ❌ <strong>Errou:</strong> Questão volta após 2 posições
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
