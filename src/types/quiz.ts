export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category?: string
  explanation?: string
}

export interface QuizState {
  currentQuestion: number
  selectedAnswers: Record<number, number>
  showResults: boolean
  timeLeft: number
  quizStarted: boolean
}