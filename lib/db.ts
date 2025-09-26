// Database connection and utility functions
// Mock implementation for demo - in production would connect to MySQL

import type { StudySession, Question, StudySet } from "./types"

// Mock data matching the seed data structure
const mockSets: StudySet[] = [
  {
    id: "set_demo",
    title: "Demo CSA",
    description: "Demonstração de questões de Ciência da Computação",
  },
]

const mockQuestions: Question[] = [
  {
    id: "q_http_idempotent",
    type: "single",
    stem: "Qual método HTTP é idempotente por definição?",
    explanation: "PUT é idempotente: múltiplas requisições produzem o mesmo efeito.",
    options: [
      { id: "o1", text: "POST", is_correct: false },
      { id: "o2", text: "PUT", is_correct: true },
      { id: "o3", text: "PATCH", is_correct: false },
      { id: "o4", text: "CONNECT", is_correct: false },
    ],
  },
  {
    id: "q_primes",
    type: "multi",
    stem: "Quais são números primos? (selecione 2)",
    explanation: "2 e 3 são primos entre as opções listadas.",
    select_count: 2,
    options: [
      { id: "p2", text: "2", is_correct: true },
      { id: "p3", text: "3", is_correct: true },
      { id: "p4", text: "4", is_correct: false },
      { id: "p5", text: "5", is_correct: false },
    ],
  },
]

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export async function getStudySession(setId: string): Promise<StudySession | null> {
  const set = mockSets.find((s) => s.id === setId)
  if (!set) return null

  const questions = mockQuestions.map((q) => ({
    ...q,
    options: shuffleArray(q.options), // Shuffle options for each question
  }))

  return {
    set,
    questions: shuffleArray(questions), // Shuffle questions order
  }
}

export async function recordProgress(
  userId: string,
  setId: string,
  questionId: string,
  result: "correct" | "wrong",
): Promise<boolean> {
  // Mock implementation - in production would save to database
  console.log(`[Progress] User ${userId}: ${questionId} = ${result}`)
  return true
}
