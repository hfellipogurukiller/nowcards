"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { Question, Feedback, SubmissionState } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronRight, Check, X } from "lucide-react"

interface QuestionCardProps {
  q: Question
  onSubmit: (markedIds: string[]) => void
  submissionState: SubmissionState
  feedback?: Feedback | null
  onNext: () => void
}

export function QuestionCard({ q, onSubmit, submissionState, feedback, onNext }: QuestionCardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showFeedbackAnimation, setShowFeedbackAnimation] = useState(false)
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null)

  // Reset selection when question changes
  useEffect(() => {
    setSelectedIds([])
    setShowFeedbackAnimation(false)
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      setAutoAdvanceTimer(null)
    }
  }, [q.id])

  useEffect(() => {
    if (submissionState === "answered" && feedback) {
      setShowFeedbackAnimation(true)

      const timer = setTimeout(() => {
        onNext()
      }, 5000)

      setAutoAdvanceTimer(timer)

      return () => {
        clearTimeout(timer)
        setAutoAdvanceTimer(null)
      }
    }
  }, [submissionState, feedback, onNext])

  const handleFeedbackClick = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer)
      setAutoAdvanceTimer(null)
    }
    onNext()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50

    if (isLeftSwipe && submissionState === "answered") {
      // Swipe left to go to next question
      onNext()
    }
  }

  const handleSingleSelect = useCallback((optionId: string) => {
    if (submissionState !== "idle") return

    setSelectedIds([optionId])

    // Auto-submit immediately after selection
    setTimeout(() => {
      onSubmit([optionId])
    }, 100)
  }, [submissionState, onSubmit])

  const handleMultiSelect = useCallback((optionId: string, checked: boolean) => {
    if (submissionState !== "idle") return

    setSelectedIds(prev => {
      let newSelectedIds: string[]
      if (checked) {
        newSelectedIds = [...prev, optionId]
      } else {
        newSelectedIds = prev.filter((id) => id !== optionId)
      }

      if (q.type === "multi" && q.select_count && newSelectedIds.length === q.select_count) {
        setTimeout(() => {
          onSubmit(newSelectedIds)
        }, 100)
      }

      return newSelectedIds
    })
  }, [submissionState, onSubmit, q.type, q.select_count])

  const canSubmit = useCallback(() => {
    if (selectedIds.length === 0) return false
    if (q.type === "multi" && q.select_count) {
      return selectedIds.length === q.select_count
    }
    return true
  }, [selectedIds.length, q.type, q.select_count])

  const getInstructionText = useMemo(() => {
    if (q.type === "single") return "Toque para selecionar uma resposta"
    if (q.type === "multi" && q.select_count) return `Selecione ${q.select_count} respostas`
    return "Marque todas as corretas"
  }, [q.type, q.select_count])

  const getOptionStyle = useCallback((optionId: string) => {
    if (submissionState !== "answered" || !feedback) return ""

    const isCorrect = q.options.find((opt) => opt.id === optionId)?.is_correct
    const wasSelected = selectedIds.includes(optionId)

    if (isCorrect) return "bg-success/30 border-success text-success-foreground shadow-lg border-2"
    if (wasSelected && !isCorrect) return "bg-destructive/30 border-destructive text-destructive-foreground shadow-lg border-2"
    return ""
  }, [submissionState, feedback, q.options, selectedIds])

  const getCorrectAnswersText = useMemo(() => {
    const correctOptions = q.options.filter((opt) => opt.is_correct)
    if (correctOptions.length === 1) {
      return `Resposta correta: ${correctOptions[0].text}`
    }
    return `Respostas corretas: ${correctOptions.map((opt) => opt.text).join(", ")}`
  }, [q.options])

  return (
    <div
      className="w-full max-w-2xl mx-auto px-4 animate-slide-up"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showFeedbackAnimation && feedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={handleFeedbackClick}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl animate-bounce-in max-w-sm mx-4 text-center",
              feedback.result === "correct"
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground",
            )}
          >
            {feedback.result === "correct" ? (
              <>
                <Check className="w-20 h-20 mb-4 animate-scale-in" />
                <h2 className="text-3xl font-bold mb-2">Correto!</h2>
                <p className="text-lg opacity-90 mb-3">Muito bem! 🎉</p>
                <p className="text-sm opacity-80 font-medium">{getCorrectAnswersText}</p>
                <p className="text-xs opacity-60 mt-3">Toque para continuar</p>
              </>
            ) : (
              <>
                <X className="w-20 h-20 mb-4 animate-scale-in" />
                <h2 className="text-3xl font-bold mb-2">Incorreto</h2>
                <p className="text-lg opacity-90 mb-3">Tente novamente! 💪</p>
                <p className="text-sm opacity-80 font-medium">{getCorrectAnswersText}</p>
                <p className="text-xs opacity-60 mt-3">Toque para continuar</p>
              </>
            )}
          </div>
        </div>
      )}

      <Card className="border-2 shadow-lg bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-balance leading-tight">{q.stem}</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">{getInstructionText}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            {q.options.map((option) => {
              const isSelected = selectedIds.includes(option.id)
              const optionStyle = getOptionStyle(option.id)
              
              return (
                <div
                  key={option.id}
                  onClick={() => q.type === "single" ? handleSingleSelect(option.id) : handleMultiSelect(option.id, !isSelected)}
                  className={cn(
                    "flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 touch-target",
                    "hover:shadow-md active:scale-[0.98] cursor-pointer",
                    "bg-card border-border hover:border-primary/70 hover:shadow-md",
                    isSelected && submissionState === "idle" && "border-primary bg-primary/5",
                    optionStyle,
                  )}
                >
                  <div className={cn(
                    "mt-1 flex-shrink-0 w-4 h-4 border-2 border-border flex items-center justify-center",
                    q.type === "single" ? "rounded-full" : "rounded"
                  )}>
                    {isSelected && <div className={cn(
                      "bg-primary",
                      q.type === "single" ? "w-2 h-2 rounded-full" : "w-2 h-2 rounded"
                    )} />}
                  </div>
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-sm sm:text-base leading-relaxed">
                    {option.text}
                  </Label>
                </div>
              )
            })}
          </div>

          {submissionState === "idle" && q.type === "multi" && !q.select_count && (
            <Button
              onClick={() => onSubmit(selectedIds)}
              disabled={selectedIds.length === 0}
              className="w-full mt-6 h-14 text-lg font-semibold rounded-xl animate-scale-in"
              size="lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Conferir Resposta
            </Button>
          )}

          {submissionState === "answered" && feedback && !showFeedbackAnimation && (
            <div className="mt-6 space-y-4 animate-fade-in">
              <div
                className={cn(
                  "p-4 rounded-xl border-2 flex items-center gap-3",
                  feedback.result === "correct"
                    ? "bg-success/10 border-success text-success-foreground"
                    : "bg-destructive/10 border-destructive text-destructive-foreground",
                )}
              >
                {feedback.result === "correct" ? (
                  <Check className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <X className="w-6 h-6 flex-shrink-0" />
                )}
                <p className="font-semibold text-base">
                  {feedback.result === "correct" ? "Correto! 🎉" : "Incorreto 😔"}
                </p>
              </div>

              {q.explanation && (
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <p className="text-sm sm:text-base leading-relaxed">
                    <strong className="text-foreground">Explicação:</strong> {q.explanation}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  data-next-button
                  onClick={onNext}
                  className="w-full h-14 text-lg font-semibold rounded-xl"
                  size="lg"
                >
                  Próxima Questão
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  💡 Dica: Deslize para a esquerda para avançar
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
