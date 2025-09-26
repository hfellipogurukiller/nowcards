import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { setId } = await req.json()

    if (!setId) {
      return NextResponse.json({ error: 'Set ID is required' }, { status: 400 })
    }

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
      userId = decoded.userId
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '45.90.123.13',
      user: process.env.DB_USER || 'c1user_nowcards',
      password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
      database: process.env.DB_NAME || 'c1db_nowcards',
      port: parseInt(process.env.DB_PORT || '3306')
    })

    try {
      // Delete all progress for this user and set
      const [result] = await connection.execute(
        'DELETE FROM user_progress WHERE user_id = ? AND question_id IN (SELECT id FROM questions WHERE set_id = ?)',
        [userId, setId]
      )

      await connection.end()

      return NextResponse.json({ 
        success: true, 
        message: 'Statistics reset successfully',
        deletedRows: (result as any).affectedRows
      })
    } catch (dbError) {
      await connection.end()
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to reset statistics' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Reset statistics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
