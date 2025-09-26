"use client"

import { Progress } from "@/components/ui/progress"
import type { StudyStats } from "@/lib/types"

interface ProgressBarProps {
  stats: StudyStats
}

export function ProgressBar({ stats }: ProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">
            Respondidas: <span className="font-medium text-foreground">{stats.answered}</span>/{stats.total}
          </span>
          <span className="text-success">
            Certas: <span className="font-medium">{stats.correct}</span>
          </span>
          <span className="text-destructive">
            Erradas: <span className="font-medium">{stats.wrong}</span>
          </span>
        </div>
        <div className="text-sm font-medium">{stats.pct}%</div>
      </div>
      <Progress value={stats.pct} className="h-2" />
    </div>
  )
}
