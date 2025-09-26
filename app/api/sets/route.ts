import { NextResponse } from "next/server"

// Mock available study sets
const availableSets = [
  {
    id: "set_demo",
    title: "Demo CSA",
    description: "Demonstração de questões de Ciência da Computação",
    questionCount: 2,
  },
]

export async function GET() {
  try {
    return NextResponse.json({ sets: availableSets })
  } catch (error) {
    console.error("Error fetching sets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
