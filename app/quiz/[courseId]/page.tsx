'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [user, setUser] = useState<any>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadQuiz = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user)

      if (!userData?.user) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch(`/api/quiz/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            userId: userData.user.id,
          }),
        })

        const quizData = await response.json()
        setQuiz(quizData.quiz)
        setAnswers(new Array(quizData.quiz.questions.length).fill(null))
      } catch (error) {
        console.error('Error loading quiz:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [courseId, router])

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    const score = answers.reduce((sum, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) return sum + 1
      return sum
    }, 0)

    const scorePercent = Math.round((score / quiz.questions.length) * 100)
    setSubmitted(true)
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Genererar quiz...</main>
  }

  if (!quiz) {
    return <main className="min-h-screen flex items-center justify-center">Kunde inte ladda quiz</main>
  }

  if (submitted) {
    const score = answers.reduce((sum, answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) return sum + 1
      return sum
    }, 0)
    const scorePercent = Math.round((score / quiz.questions.length) * 100)

    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="glass p-8 rounded-2xl max-w-md text-center">
          <h1 className="text-4xl font-bold text-neon mb-4">Klart!</h1>
          <p className="text-5xl font-bold mb-4">{scorePercent}%</p>
          <p className="text-slate-400 mb-2">
            Du svarade rätt på {score} av {quiz.questions.length} frågor
          </p>
          <div className="space-y-2 mt-6">
            <button onClick={() => router.push('/kurser')} className="w-full px-6 py-3 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
              Tillbaka till Kurser
            </button>
            <button onClick={() => router.push(`/quiz/${courseId}`)} className="w-full px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition">
              Gör Nytt Quiz
            </button>
          </div>
        </div>
      </main>
    )
  }

  const currentQ = quiz.questions[currentQuestion]

  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-slate-400 mb-2">Fråga {currentQuestion + 1} av {quiz.questions.length}</p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-neon h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-8">{currentQ.question}</h2>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-lg transition-smooth text-left ${
                  answers[currentQuestion] === index
                    ? 'bg-neon text-black border-2 border-neon'
                    : 'bg-slate-700 border-2 border-transparent hover:border-neon'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
          >
            Föregående
          </button>
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={answers[currentQuestion] === null}
              className="flex-1 px-4 py-2 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
            >
              Nästa
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers.some((a) => a === null)}
              className="flex-1 px-4 py-2 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
            >
              Skicka Svar
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
