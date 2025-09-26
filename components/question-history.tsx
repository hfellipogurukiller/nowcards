"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { getSetProgress, type UserProgress } from "@/lib/progress-storage"
import type { Question } from "@/lib/types"

interface QuestionHistoryProps {
  setId: string
  questions: Question[]
}

export function QuestionHistory({ setId, questions }: QuestionHistoryProps) {
  const { user } = useUser()
  const [progress, setProgress] = useState<UserProgress[]>([])

  useEffect(() => {
    if (!user) return

    const updateProgress = () => {
      const setProgress = getSetProgress(user.id, setId)
      setProgress(setProgress)
    }

    updateProgress()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("studycards-progress")) {
        updateProgress()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    const interval = setInterval(updateProgress, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [user, setId])

  if (!user || progress.length === 0) {
    return null
  }

  const getQuestionTitle = (questionId: string): string => {
    const question = questions.find((q) => q.id === questionId)
    return question ? question.stem.substring(0, 60) + "..." : "Questão não encontrada"
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Questões
        </CardTitle>
        <CardDescription>Acompanhe seu progresso em cada questão</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {progress
              .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
              .map((item) => (
                <div key={item.questionId} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">{getQuestionTitle(item.questionId)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Última tentativa: {formatDate(item.lastSeen)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-success border-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {item.correctCount}
                      </Badge>
                      <Badge variant="outline" className="text-destructive border-destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        {item.wrongCount}
                      </Badge>
                    </div>

                    <Badge
                      variant={item.lastResult === "correct" ? "default" : "destructive"}
                      className="min-w-[60px] justify-center"
                    >
                      {item.lastResult === "correct" ? "Acerto" : "Erro"}
                    </Badge>

                    {item.streak > 0 && (
                      <Badge variant="outline" className="text-accent border-accent">
                        🔥 {item.streak}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
