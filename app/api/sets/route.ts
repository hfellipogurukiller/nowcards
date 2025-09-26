import { NextResponse } from "next/server"
import mysql from 'mysql2/promise'

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '45.90.123.13',
      user: process.env.DB_USER || 'c1user_nowcards',
      password: process.env.DB_PASSWORD || 'K_6Tu4kfVf',
      database: process.env.DB_NAME || 'c1db_nowcards',
      port: parseInt(process.env.DB_PORT || '3306')
    })

    // Get all study sets with question counts
    const [sets] = await connection.execute(`
      SELECT 
        s.id,
        s.title,
        s.description,
        COUNT(q.id) as questionCount
      FROM study_sets s
      LEFT JOIN questions q ON s.id = q.set_id
      GROUP BY s.id, s.title, s.description
      HAVING questionCount > 0
      ORDER BY s.title
    `)

    await connection.end()

    return NextResponse.json({ sets })
  } catch (error) {
    console.error("Error fetching sets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
