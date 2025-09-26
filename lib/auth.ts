import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '45.90.123.13',
  user: process.env.DB_USER || 'c1user_nowcards',
  password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
  database: process.env.DB_NAME || 'c1db_nowcards',
  port: parseInt(process.env.DB_PORT || '3306'),
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResult {
  user: User | null
  error?: string
}

export async function verifyToken(token: string): Promise<AuthResult> {
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.userId) {
      return { user: null, error: 'Invalid token' }
    }

    // Check if session exists in database
    const connection = await mysql.createConnection(dbConfig)
    
    try {
      const [sessions] = await connection.execute(
        'SELECT user_id FROM user_sessions WHERE token_hash = ? AND expires_at > NOW()',
        [token]
      )

      if (!Array.isArray(sessions) || sessions.length === 0) {
        return { user: null, error: 'Session expired' }
      }

      // Get user details
      const [users] = await connection.execute(
        'SELECT id, email, name FROM users WHERE id = ?',
        [decoded.userId]
      )

      if (!Array.isArray(users) || users.length === 0) {
        return { user: null, error: 'User not found' }
      }

      const user = users[0] as User
      return { user }

    } finally {
      await connection.end()
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return { user: null, error: 'Invalid token' }
  }
}

export async function getCurrentUser(request: Request): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No token provided' }
    }

    const token = authHeader.substring(7)
    return await verifyToken(token)

  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error: 'Authentication failed' }
  }
}

export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
