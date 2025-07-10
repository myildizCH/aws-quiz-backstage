"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react'
import useSWR from "swr"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category?: string
  explanation?: string
}

interface QuizContainerProps {
  initialQuestions: QuizQuestion[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function QuizContainer({ initialQuestions }: QuizContainerProps) {
  // Use SWR for client-side data fetching with fallback data
  const { data: questions, error } = useSWR<QuizQuestion[]>("/api/quiz/questions", fetcher, {
    fallbackData: initialQuestions,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set())

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, showResults])

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load quiz</h3>
          <p className="text-red-600">Please try refreshing the page.</p>
        </CardContent>
      </Card>
    )
  }

  if (!questions) {
    return <div>Loading quiz questions...</div>
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) {
      // If answer is already shown, clicking acts as "Next"
      handleNext()
    } else {
      // First click: select answer and show feedback
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion]: answerIndex,
      }))
      setShowAnswer(true)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      setShowResults(true)
    }
  }

  const handleSkip = () => {
    // Only allow skipping if no answer has been selected
    if (selectedAnswers[currentQuestion] === undefined) {
      setSkippedQuestions((prev) => new Set([...prev, currentQuestion]))
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setShowAnswer(false)
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setShowAnswer(selectedAnswers[currentQuestion - 1] !== undefined)
    }
  }

  const calculateScore = () => {
    let correct = 0
    let answered = 0
    questions.forEach((question, index) => {
      if (!skippedQuestions.has(index)) {
        answered++
        if (selectedAnswers[index] === question.correctAnswer) {
          correct++
        }
      }
    })
    return { correct, answered, total: questions.length, skipped: skippedQuestions.size }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setSkippedQuestions(new Set())
    setShowResults(false)
    setTimeLeft(300)
    setQuizStarted(false)
    setShowAnswer(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!quizStarted) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Ready to Start?</CardTitle>
          <p className="text-gray-600 mt-2">
            You'll have 5 minutes to answer {questions.length} questions about AWS technologies.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{questions.length}</div>
              <div className="text-sm text-orange-800">Questions</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5:00</div>
              <div className="text-sm text-blue-800">Time Limit</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">AWS</div>
              <div className="text-sm text-green-800">Focus</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Pro</div>
              <div className="text-sm text-purple-800">Level</div>
            </div>
          </div>
          <Button onClick={() => setQuizStarted(true)} size="lg" className="px-8">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResults) {
    const scoreData = calculateScore()
    const percentage = scoreData.answered > 0 ? Math.round((scoreData.correct / scoreData.answered) * 100) : 0

    return (
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {scoreData.correct}/{scoreData.answered}
            </div>
            <div className="text-xl text-gray-600">{percentage}% Correct</div>
            {scoreData.skipped > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                ({scoreData.skipped} question{scoreData.skipped !== 1 ? "s" : ""} skipped)
              </div>
            )}
            <Badge
              variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}
              className="mt-2"
            >
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Learning!"}
            </Badge>
          </div>

          <div className="space-y-3 mb-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isSkipped = skippedQuestions.has(index)
              const isCorrect = !isSkipped && userAnswer === question.correctAnswer

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isSkipped
                      ? "bg-gray-50 border-gray-200"
                      : isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {question.question.length > 60 ? `${question.question.substring(0, 60)}...` : question.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isSkipped ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">-</span>
                        </div>
                        <Badge variant="outline" className="text-gray-600 border-gray-400 min-w-[70px] justify-center">
                          Skipped
                        </Badge>
                      </>
                    ) : isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <Badge
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 min-w-[70px] justify-center"
                        >
                          Correct
                        </Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-600" />
                        <Badge variant="destructive" className="min-w-[70px] justify-center">
                          Wrong
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <Button onClick={resetQuiz} className="px-8">
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
        {question.category && (
          <Badge variant="secondary" className="w-fit">
            {question.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index
            const isCorrect = index === question.correctAnswer
            const showCorrectAnswer = showAnswer

            let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all "

            if (showCorrectAnswer) {
              if (isSelected && isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800"
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800"
              } else if (!isSelected && isCorrect) {
                buttonClass += "border-green-500 bg-green-100 text-green-800"
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600"
              }
            } else if (isSelected) {
              buttonClass += "border-blue-500 bg-blue-50"
            } else {
              buttonClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }

            return (
              <button key={index} onClick={() => handleAnswerSelect(index)} className={buttonClass}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                  <div className="flex items-center gap-2">
                    {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    {showAnswer && isSelected && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {showAnswer && !isSelected && isCorrect && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Correct</span>
                      </div>
                    )}
                    {showAnswer && isSelected && (
                      <span className="text-sm font-medium text-blue-600 ml-2">Click to continue →</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {showAnswer && question.explanation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                <p className="text-blue-800 text-sm">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          {!showAnswer && (
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}