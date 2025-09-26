// Database connection and utility functions
import mysql from 'mysql2/promise'
import type { StudySession, Question, StudySet } from "./types"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Database utility functions

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
  try {
    const connection = await pool.getConnection()
    
    // Get study set
    const [setRows] = await connection.execute(
      'SELECT id, title, description FROM study_sets WHERE id = ?',
      [setId]
    )
    
    if (!Array.isArray(setRows) || setRows.length === 0) {
      connection.release()
      return null
    }
    
    const set = setRows[0] as StudySet
    
    // Get questions for this set
    const [questionRows] = await connection.execute(
      'SELECT id, type, stem, explanation, select_count FROM questions WHERE set_id = ?',
      [setId]
    )
    
    const questions: Question[] = []
    
    for (const questionRow of questionRows as any[]) {
      // Get options for each question
      const [optionRows] = await connection.execute(
        'SELECT id, text, is_correct FROM question_options WHERE question_id = ? ORDER BY id',
        [questionRow.id]
      )
      
      const question: Question = {
        id: questionRow.id,
        type: questionRow.type,
        stem: questionRow.stem,
        explanation: questionRow.explanation,
        select_count: questionRow.select_count,
        options: (optionRows as any[]).map(opt => ({
          id: opt.id,
          text: opt.text,
          is_correct: Boolean(opt.is_correct)
        }))
      }
      
      questions.push(question)
    }
    
    connection.release()
    
    // Shuffle questions and options
    const shuffledQuestions = questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }))
    
    return {
      set,
      questions: shuffleArray(shuffledQuestions),
    }
  } catch (error) {
    console.error('Error getting study session:', error)
    return null
  }
}

export async function recordProgress(
  userId: string,
  setId: string,
  questionId: string,
  result: "correct" | "wrong",
): Promise<boolean> {
  try {
    const connection = await pool.getConnection()
    
    // Insert or update progress record
    await connection.execute(
      `INSERT INTO user_progress (user_id, set_id, question_id, result, created_at) 
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
       result = VALUES(result), 
       created_at = NOW()`,
      [userId, setId, questionId, result === 'correct' ? 1 : 0]
    )
    
    connection.release()
    console.log(`[Progress] User ${userId}: ${questionId} = ${result}`)
    return true
  } catch (error) {
    console.error('Error recording progress:', error)
    return false
  }
}
