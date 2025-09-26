import { type NextRequest, NextResponse } from "next/server"
import { getStudySession } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const setId = params.id
    const session = await getStudySession(setId)

    if (!session) {
      return NextResponse.json({ error: "Study set not found" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching study session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
