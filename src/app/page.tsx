import { Suspense } from "react"
import QuizContainer from "@/components/quiz-container"
import { getQuizQuestions } from "@/lib/quiz-data"

// This page uses SSR to fetch initial quiz data
export default async function QuizPage() {
  // Server-side data fetching for initial questions
  const initialQuestions = await getQuizQuestions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AWS Technologies Quiz</h1>
          <p className="text-lg text-gray-600">Test your knowledge of AWS Lambda, EC2, S3, and more!</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🏢 Backstage Integration Ready
          </div>
        </header>

        <Suspense fallback={<QuizSkeleton />}>
          <QuizContainer initialQuestions={initialQuestions} />
        </Suspense>
      </div>
    </div>
  )
}

function QuizSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}

// Enable ISR - regenerate every hour
export const revalidate = 3600