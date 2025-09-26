"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TrendingUp, Target, Award, Clock, ChevronDown, ChevronUp, BarChart3, RotateCcw } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { calculateSessionStats, type SessionStats } from "@/lib/progress-storage"

interface ProgressDashboardProps {
  setId: string
  totalQuestions: number
  onResetStats?: () => void
  showResetButton?: boolean
}

export function ProgressDashboard({ setId, totalQuestions, onResetStats, showResetButton = false }: ProgressDashboardProps) {
  const { user } = useUser()
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [isStatsOpen, setIsStatsOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const updateStats = () => {
      const sessionStats = calculateSessionStats(user.id, setId, totalQuestions)
      setStats(sessionStats)
    }

    updateStats()

    // Update stats when localStorage changes (from other tabs/sessions)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("studycards-progress")) {
        updateStats()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also update periodically in case of same-tab updates
    const interval = setInterval(updateStats, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [user, setId, totalQuestions])

  if (!user || !stats) {
    return null
  }

  const progressPercentage = (stats.completedQuestions / stats.totalQuestions) * 100

  return (
    <div className="mb-4">
      <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 sm:p-3 h-auto mb-3 bg-card hover:bg-accent/50 border border-border rounded-lg"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="font-medium text-sm sm:text-base">Estatísticas</span>
              <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                {Math.round(progressPercentage)}%
              </Badge>
            </div>
            {isStatsOpen ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2 sm:px-3 sm:pt-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Progresso</CardTitle>
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-2 pb-2 sm:px-3 sm:pb-3">
                <div className="text-lg sm:text-2xl font-bold">
                  {stats.completedQuestions}/{stats.totalQuestions}
                </div>
                <Progress value={progressPercentage} className="mt-1 h-1.5 sm:h-2" />
                <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPercentage)}%</p>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2 sm:px-3 sm:pt-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Precisão</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-2 pb-2 sm:px-3 sm:pb-3">
                <div className="text-lg sm:text-2xl font-bold">{stats.accuracy}%</div>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-success border-success text-xs px-1 py-0">
                    ✓ {stats.correctAnswers}
                  </Badge>
                  <Badge variant="outline" className="text-destructive border-destructive text-xs px-1 py-0">
                    ✗ {stats.wrongAnswers}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2 sm:px-3 sm:pt-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Sequência</CardTitle>
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-2 pb-2 sm:px-3 sm:pb-3">
                <div className="text-lg sm:text-2xl font-bold">{stats.averageStreak}</div>
                <p className="text-xs text-muted-foreground">consecutivos</p>
              </CardContent>
            </Card>

            <Card className="p-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2 sm:px-3 sm:pt-3">
                <CardTitle className="text-xs sm:text-sm font-medium">Status</CardTitle>
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-2 pb-2 sm:px-3 sm:pb-3">
                <div className="text-sm sm:text-lg font-bold">
                  {stats.completedQuestions === stats.totalQuestions ? "Completo" : "Ativo"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedQuestions === stats.totalQuestions
                    ? "Finalizado"
                    : `${stats.totalQuestions - stats.completedQuestions} restantes`}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {showResetButton && onResetStats && (
            <div className="pt-3 border-t border-border">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onResetStats}
                className="w-full gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar Estatísticas
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
