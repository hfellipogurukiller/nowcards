import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306'),
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    const connection = await mysql.createConnection(dbConfig)

    try {
      // Decode the token to get user ID
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      if (!decoded.userId) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }
      
      // Delete all sessions for this user
      await connection.execute(
        'DELETE FROM user_sessions WHERE user_id = ?',
        [decoded.userId]
      )

      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      })

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
