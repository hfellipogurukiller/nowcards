// Client-side progress tracking using localStorage
// Each user has isolated progress data

export interface UserProgress {
  userId: string
  setId: string
  questionId: string
  correctCount: number
  wrongCount: number
  lastResult: "correct" | "wrong"
  lastSeen: string
  streak: number
}

export interface SessionStats {
  totalQuestions: number
  completedQuestions: number
  correctAnswers: number
  wrongAnswers: number
  accuracy: number
  averageStreak: number
}

const PROGRESS_KEY = "studycards-progress"

export function getProgressKey(userId: string): string {
  return `${PROGRESS_KEY}-${userId}`
}

export function getUserProgress(userId: string): UserProgress[] {
  try {
    const data = localStorage.getItem(getProgressKey(userId))
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to load user progress:", error)
    return []
  }
}

export function saveUserProgress(userId: string, progress: UserProgress[]): void {
  try {
    localStorage.setItem(getProgressKey(userId), JSON.stringify(progress))
  } catch (error) {
    console.error("Failed to save user progress:", error)
  }
}

export function updateQuestionProgress(
  userId: string,
  setId: string,
  questionId: string,
  result: "correct" | "wrong",
): void {
  const allProgress = getUserProgress(userId)
  const existingIndex = allProgress.findIndex((p) => p.setId === setId && p.questionId === questionId)

  if (existingIndex >= 0) {
    const existing = allProgress[existingIndex]
    allProgress[existingIndex] = {
      ...existing,
      correctCount: existing.correctCount + (result === "correct" ? 1 : 0),
      wrongCount: existing.wrongCount + (result === "wrong" ? 1 : 0),
      lastResult: result,
      lastSeen: new Date().toISOString(),
      streak: result === "correct" ? existing.streak + 1 : 0,
    }
  } else {
    allProgress.push({
      userId,
      setId,
      questionId,
      correctCount: result === "correct" ? 1 : 0,
      wrongCount: result === "wrong" ? 1 : 0,
      lastResult: result,
      lastSeen: new Date().toISOString(),
      streak: result === "correct" ? 1 : 0,
    })
  }

  saveUserProgress(userId, allProgress)
}

export function getSetProgress(userId: string, setId: string): UserProgress[] {
  return getUserProgress(userId).filter((p) => p.setId === setId)
}

export function calculateSessionStats(userId: string, setId: string, totalQuestions: number): SessionStats {
  console.log('calculateSessionStats called', { userId, setId, totalQuestions })
  const setProgress = getSetProgress(userId, setId)
  console.log('setProgress from localStorage:', setProgress)

  const completedQuestions = setProgress.length
  const correctAnswers = setProgress.reduce((sum, p) => sum + p.correctCount, 0)
  const wrongAnswers = setProgress.reduce((sum, p) => sum + p.wrongCount, 0)
  const totalAnswers = correctAnswers + wrongAnswers
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
  const averageStreak =
    setProgress.length > 0 ? setProgress.reduce((sum, p) => sum + p.streak, 0) / setProgress.length : 0

  const stats = {
    totalQuestions,
    completedQuestions,
    correctAnswers,
    wrongAnswers,
    accuracy: Math.round(accuracy),
    averageStreak: Math.round(averageStreak * 10) / 10,
  }
  
  console.log('calculated stats:', stats)
  return stats
}

export function clearUserProgress(userId: string): void {
  try {
    localStorage.removeItem(getProgressKey(userId))
  } catch (error) {
    console.error("Failed to clear user progress:", error)
  }
}
