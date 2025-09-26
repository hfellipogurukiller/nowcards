// Type definitions for the MCQ study app

export type QuestionType = "single" | "multi"

export interface Option {
  id: string
  text: string
  is_correct: boolean
}

export interface Question {
  id: string
  type: QuestionType
  stem: string
  options: Option[]
  explanation?: string
  select_count?: number
}

export interface StudySet {
  id: string
  title: string
  description?: string
}

export interface StudySession {
  set: StudySet
  questions: Question[]
}

export interface Feedback {
  result: "correct" | "wrong"
  correctIds: string[]
}

export interface StudyStats {
  total: number
  answered: number
  correct: number
  wrong: number
  pct: number
}

export type SubmissionState = "idle" | "answered"
