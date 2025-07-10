import { NextResponse } from "next/server"
import { getQuizQuestions } from "@/lib/quiz-data"

// API route for SWR data fetching
export async function GET() {
  try {
    const questions = await getQuizQuestions()

    // Add cache headers for better performance
    return NextResponse.json(questions, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
  }
}