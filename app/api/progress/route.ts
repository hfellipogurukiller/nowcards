import { type NextRequest, NextResponse } from "next/server"
import { recordProgress } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, set_id, question_id, result } = body

    if (!user_id || !set_id || !question_id || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["correct", "wrong"].includes(result)) {
      return NextResponse.json({ error: "Invalid result value" }, { status: 400 })
    }

    await recordProgress(user_id, set_id, question_id, result)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error recording progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
