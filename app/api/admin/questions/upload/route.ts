import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  tags: string[]
  domain: string
}

interface QuestionSet {
  certification: string
  description: string
  version: string
  questions: Question[]
}

export async function POST(request: NextRequest) {
  try {
    const questionSet: QuestionSet = await request.json()
    
    // Validate required fields
    if (!questionSet.certification || !questionSet.questions || !Array.isArray(questionSet.questions)) {
      return NextResponse.json(
        { error: 'Invalid JSON structure. Missing required fields: certification, questions' },
        { status: 400 }
      )
    }

    // Validate each question
    for (const question of questionSet.questions) {
      if (!question.id || !question.question || !question.options || 
          !Array.isArray(question.options) || question.correct_answer === undefined) {
        return NextResponse.json(
          { error: `Invalid question structure for question: ${question.id || 'unknown'}` },
          { status: 400 }
        )
      }
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '45.90.123.13',
      user: process.env.DB_USER || 'c1user_nowcards',
      password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
      database: process.env.DB_NAME || 'c1db_nowcards',
      port: parseInt(process.env.DB_PORT || '3306')
    })
    
    try {
      // Start transaction
      await connection.beginTransaction()

      // Check if certification already exists, if not create it
      const [existingCert] = await connection.execute(
        'SELECT id FROM study_sets WHERE title = ?',
        [questionSet.certification]
      )

      let setId: string
      if (Array.isArray(existingCert) && existingCert.length > 0) {
        setId = (existingCert[0] as any).id
      } else {
        // Create new study set with UUID
        const crypto = require('crypto')
        setId = crypto.randomUUID()
        await connection.execute(
          'INSERT INTO study_sets (id, title, description, version, created_at) VALUES (?, ?, ?, ?, NOW())',
          [setId, questionSet.certification, questionSet.description || '', questionSet.version || '1.0']
        )
      }

      let questionsAdded = 0
      let questionsUpdated = 0

      // Process each question
      for (const question of questionSet.questions) {
        // Generate UUID for question if not provided
        const crypto = require('crypto')
        const questionId = question.id || crypto.randomUUID()
        
        
        // Check if question already exists
        const [existingQuestion] = await connection.execute(
          'SELECT id FROM questions WHERE id = ?',
          [questionId]
        )

        if (Array.isArray(existingQuestion) && existingQuestion.length > 0) {
          // Update existing question
          await connection.execute(
            'UPDATE questions SET stem = ?, explanation = ?, difficulty = ?, domain = ?, updated_at = NOW() WHERE id = ?',
            [question.question, question.explanation, question.difficulty, question.domain, questionId]
          )

          // Delete existing options
          await connection.execute(
            'DELETE FROM question_options WHERE question_id = ?',
            [questionId]
          )

          // Insert new options
          for (let i = 0; i < question.options.length; i++) {
            const optionId = crypto.randomUUID()
            await connection.execute(
              'INSERT INTO question_options (id, question_id, text, is_correct) VALUES (?, ?, ?, ?)',
              [optionId, questionId, question.options[i], i === question.correct_answer ? 1 : 0]
            )
          }

          questionsUpdated++
        } else {
          // Insert new question
          await connection.execute(
            'INSERT INTO questions (id, set_id, type, stem, explanation, difficulty, domain, select_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [questionId, setId, 'single', question.question, question.explanation, question.difficulty, question.domain, 1]
          )

          // Insert options
          for (let i = 0; i < question.options.length; i++) {
            const optionId = crypto.randomUUID()
            await connection.execute(
              'INSERT INTO question_options (id, question_id, text, is_correct) VALUES (?, ?, ?, ?)',
              [optionId, questionId, question.options[i], i === question.correct_answer ? 1 : 0]
            )
          }

          questionsAdded++
        }
      }

      // Commit transaction
      await connection.commit()

      return NextResponse.json({
        success: true,
        certification: questionSet.certification,
        questionsAdded,
        questionsUpdated,
        totalProcessed: questionSet.questions.length,
        message: `Processamento concluído: ${questionsAdded} questões adicionadas, ${questionsUpdated} atualizadas`
      })

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback()
      throw error
    } finally {
      connection.end()
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
