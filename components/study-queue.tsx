"use client"

import { useState, useEffect, useCallback } from "react"
import type { Question, Feedback, StudyStats, SubmissionState } from "@/lib/types"
import { QuestionCard } from "./question-card"
import { ProgressBar } from "./progress-bar"
import { ProgressDashboard } from "./progress-dashboard"
import { QuestionHistory } from "./question-history"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, RotateCcw, BarChart3 } from "lucide-react"
import { updateQuestionProgress } from "@/lib/progress-storage"
import { ResetStatsModal } from "./reset-stats-modal"
import { useUser } from "@/lib/user-context"

interface StudyQueueProps {
  questions: Question[]
  setId: string
  userId: string
}

export function StudyQueue({ questions, setId, userId }: StudyQueueProps) {
  const { user } = useUser()
  const [queue, setQueue] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [stats, setStats] = useState<StudyStats>({
    total: questions.length,
    answered: 0,
    correct: 0,
    wrong: 0,
    pct: 0,
  })
  const [showHistory, setShowHistory] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0) // Trigger to force ProgressDashboard refresh

  // Initialize queue with shuffled questions
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCurrentQuestion(shuffled[0] || null)
  }, [questions])

  // Handle next question event
  useEffect(() => {
    const handleNextQuestion = () => {
      moveToNextQuestion()
    }

    window.addEventListener("next-question", handleNextQuestion)
    return () => window.removeEventListener("next-question", handleNextQuestion)
  }, [])

  const gradeAnswer = (question: Question, markedIds: string[]): boolean => {
    const correctIds = question.options
      .filter((opt) => opt.is_correct)
      .map((opt) => opt.id)
      .sort()

    const selectedIds = [...markedIds].sort()

    if (question.type === "single") {
      return selectedIds.length === 1 && correctIds.includes(selectedIds[0])
    } else {
      return JSON.stringify(selectedIds) === JSON.stringify(correctIds)
    }
  }

  const handleSubmit = async (markedIds: string[]) => {
    if (!currentQuestion) return

    const isCorrect = gradeAnswer(currentQuestion, markedIds)
    const correctIds = currentQuestion.options.filter((opt) => opt.is_correct).map((opt) => opt.id)

    const newFeedback: Feedback = {
      result: isCorrect ? "correct" : "wrong",
      correctIds,
    }

    setFeedback(newFeedback)
    setSubmissionState("answered")

    updateQuestionProgress(userId, setId, currentQuestion.id, isCorrect ? "correct" : "wrong")

    // Update stats
    setStats((prev) => {
      const newAnswered = prev.answered + 1
      const newCorrect = prev.correct + (isCorrect ? 1 : 0)
      const newWrong = prev.wrong + (isCorrect ? 0 : 1)
      const newPct = Math.round((newAnswered / prev.total) * 100)

      return {
        ...prev,
        answered: newAnswered,
        correct: newCorrect,
        wrong: newWrong,
        pct: newPct,
      }
    })

    // Record progress (optional API call)
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          set_id: setId,
          question_id: currentQuestion.id,
          result: isCorrect ? "correct" : "wrong",
        }),
      })
    } catch (error) {
      console.error("Failed to record progress:", error)
    }
  }

  const moveToNextQuestion = useCallback(() => {
    if (!currentQuestion) return

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue]
      const currentIndex = newQueue.findIndex((q) => q.id === currentQuestion.id)

      if (currentIndex === -1) return newQueue

      // Remove current question from queue
      const [removedQuestion] = newQueue.splice(currentIndex, 1)

      if (feedback?.result === "correct") {
        // Correct: add to end of queue
        newQueue.push(removedQuestion)
      } else {
        // Wrong: reinsert after 2 positions (or at end if queue is too short)
        const insertPosition = Math.min(2, newQueue.length)
        newQueue.splice(insertPosition, 0, removedQuestion)
      }

      // Set next current question
      const nextQuestion = newQueue[0] || null
      setCurrentQuestion(nextQuestion)

      return newQueue
    })

    // Reset state for next question
    setSubmissionState("idle")
    setFeedback(null)
  }, [currentQuestion, feedback])

  const resetStudy = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQueue(shuffled)
    setCurrentQuestion(shuffled[0] || null)
    setSubmissionState("idle")
    setFeedback(null)
    setStats({
      total: questions.length,
      answered: 0,
      correct: 0,
      wrong: 0,
      pct: 0,
    })
    setShowHistory(false)
  }

  const handleResetStats = async () => {
    console.log('handleResetStats called', { user: user?.id, setId })
    if (!user?.token) {
      console.log('No user token available')
      return
    }

    setIsResetting(true)
    try {
      console.log('Calling reset API...')
      const response = await fetch('/api/progress/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ setId })
      })

      console.log('Reset API response:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Reset API error:', errorData)
        throw new Error('Failed to reset statistics')
      }

      console.log('Reset successful, updating local state...')

      // Clear localStorage progress for this user and set
      if (user?.id) {
        console.log('Clearing localStorage progress...')
        const { clearUserProgress } = await import('@/lib/progress-storage')
        clearUserProgress(user.id)
        console.log('localStorage cleared')
      }

      // Reset local state
      setStats({
        total: questions.length,
        answered: 0,
        correct: 0,
        wrong: 0,
        pct: 0,
      })
      
      // Reset queue with fresh questions
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setQueue(shuffled)
      setCurrentQuestion(shuffled[0] || null)
      setSubmissionState("idle")
      setFeedback(null)

      console.log('Local state reset completed')

      // Trigger ProgressDashboard refresh
      setResetTrigger(prev => prev + 1)

      // Show success message
      const { toast } = await import('sonner')
      toast.success('Estatísticas resetadas com sucesso!')
    } catch (error) {
      console.error('Reset error:', error)
      const { toast } = await import('sonner')
      toast.error('Erro ao resetar estatísticas')
    } finally {
      setIsResetting(false)
    }
  }

  if (stats.answered >= questions.length && queue.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <ProgressDashboard 
        setId={setId} 
        totalQuestions={questions.length}
        onResetStats={() => setShowResetModal(true)}
        showResetButton={true}
        resetTrigger={resetTrigger}
      />

        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-2">Parabéns!</h2>
            <p className="text-muted-foreground mb-4">Você completou todas as questões!</p>
            <div className="space-y-2 mb-6">
              <p>
                Acertos: <span className="font-medium text-success">{stats.correct}</span>
              </p>
              <p>
                Erros: <span className="font-medium text-destructive">{stats.wrong}</span>
              </p>
              <p>
                Taxa de acerto: <span className="font-medium">{Math.round((stats.correct / stats.total) * 100)}%</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetStudy} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Estudar Novamente
              </Button>
              <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                {showHistory ? "Ocultar" : "Ver"} Histórico
              </Button>
            </div>
          </CardContent>
        </Card>

        {showHistory && <QuestionHistory setId={setId} questions={questions} />}
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando questões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <ProgressDashboard 
        setId={setId} 
        totalQuestions={questions.length}
        onResetStats={() => setShowResetModal(true)}
        showResetButton={true}
        resetTrigger={resetTrigger}
      />
      <ProgressBar stats={stats} />
      <QuestionCard
        q={currentQuestion}
        onSubmit={handleSubmit}
        submissionState={submissionState}
        feedback={feedback}
        onNext={moveToNextQuestion}
      />
      
      <ResetStatsModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetStats}
        stats={stats}
        loading={isResetting}
      />
    </div>
  )
}
