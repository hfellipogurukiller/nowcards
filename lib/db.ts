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
    
    // Optimized single query with JOIN - much faster for large datasets
    const [rows] = await connection.execute(`
      SELECT 
        s.id as set_id,
        s.title as set_title,
        s.description as set_description,
        q.id as question_id,
        q.type as question_type,
        q.stem as question_stem,
        q.explanation as question_explanation,
        q.select_count as question_select_count,
        qo.id as option_id,
        qo.text as option_text,
        qo.is_correct as option_is_correct
      FROM study_sets s
      INNER JOIN questions q ON s.id = q.set_id
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE s.id = ?
      ORDER BY q.id, qo.id
    `, [setId])
    
    if (!Array.isArray(rows) || rows.length === 0) {
      connection.release()
      return null
    }
    
    // Process results into structured data
    const set: StudySet = {
      id: (rows[0] as any).set_id,
      title: (rows[0] as any).set_title,
      description: (rows[0] as any).set_description
    }
    
    // Group questions and options
    const questionsMap = new Map<string, Question>()
    
    for (const row of rows as any[]) {
      const questionId = row.question_id
      
      if (!questionsMap.has(questionId)) {
        questionsMap.set(questionId, {
          id: questionId,
          type: row.question_type,
          stem: row.question_stem,
          explanation: row.question_explanation,
          select_count: row.question_select_count,
          options: []
        })
      }
      
      // Add option if it exists
      if (row.option_id) {
        questionsMap.get(questionId)!.options.push({
          id: row.option_id,
          text: row.option_text,
          is_correct: Boolean(row.option_is_correct)
        })
      }
    }
    
    const questions = Array.from(questionsMap.values())
    
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
