'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  category: string
}

interface QuizState {
  questions: Question[]
  currentQuestion: number
  selectedAnswers: (number | null)[]
  isLoading: boolean
  isFinished: boolean
  score: number
}

export default function QuizPage() {
  const params = useParams()
  const courseId = params.courseId
  const router = useRouter()

  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    selectedAnswers: [],
    isLoading: true,
    isFinished: false,
    score: 0,
  })

  useEffect(() => {
    loadQuiz()
  }, [courseId])

  const loadQuiz = async () => {
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })

      const data = await res.json()
      setState((prev) => ({
        ...prev,
        questions: data.questions,
        selectedAnswers: Array(data.questions.length).fill(null),
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error loading quiz:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...state.selectedAnswers]
    newAnswers[state.currentQuestion] = optionIndex
    setState((prev) => ({ ...prev, selectedAnswers: newAnswers }))
  }

  const handleNext = () => {
    if (state.currentQuestion < state.questions.length - 1) {
      setState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }))
    } else {
      finishQuiz()
    }
  }

  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))
    }
  }

  const finishQuiz = () => {
    let score = 0
    state.selectedAnswers.forEach((answer, idx) => {
      if (answer === state.questions[idx].correct) {
        score++
      }
    })

    if (score / state.questions.length > 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    setState((prev) => ({
      ...prev,
      isFinished: true,
      score,
    }))
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-neon/30 border-t-neon animate-spin"></div>
          <p className="text-xl font-semibold text-text-primary animate-pulse">Fixar ditt quiz...</p>
          <p className="text-text-tertiary">Det här tar bara några sekunder</p>
        </div>
      </div>
    )
  }

  if (state.isFinished) {
    const scorePercentage = Math.round((state.score / state.questions.length) * 100)
    const isPerfect = scorePercentage === 100
    const isGood = scorePercentage >= 70
    const feedback = isPerfect
      ? 'PERFEKT! Du är en riktig NP-Monster! 🤖'
      : isGood
      ? 'Bra jobbat! Du är på rätt väg 🚀'
      : 'Övning ger färdighet – försök igen!'

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Score Circle */}
            <motion.div
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-neon/20 to-accent/20 border-2 border-neon flex items-center justify-center relative"
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-6xl font-black text-neon">{scorePercentage}%</div>
                <div className="text-sm text-text-tertiary mt-1">{state.score} av {state.questions.length} rätt</div>
              </div>
            </motion.div>

            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-black gradient-text-static mb-2">{feedback}</h1>
              <p className="text-text-secondary">
                {isGood
                  ? 'Du är väl förberedd för provet! Vill du träna på något annat?'
                  : 'Det finns alltid plats för förbättring. Försök igen för att se om du kan göra det bättre!'}
              </p>
            </motion.div>

            {/* Results */}
            <motion.div
              className="glass-lg p-8 rounded-2xl space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-text-primary text-left">Din test:</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.questions.map((q, idx) => {
                  const isCorrect = state.selectedAnswers[idx] === q.correct
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'bg-success/10 border-success/30'
                          : 'bg-danger/10 border-danger/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-1 flex-shrink-0 ${isCorrect ? 'text-success' : 'text-danger'}`}
                        >
                          {isCorrect ? <Check size={20} /> : <X size={20} />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-text-primary text-sm mb-1">{q.question}</p>
                          <p className="text-xs text-text-tertiary">
                            Din svar: <span className={isCorrect ? 'text-success' : 'text-danger'}>{q.options[state.selectedAnswers[idx]!]}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-xs text-text-tertiary">
                              Rätt svar: <span className="text-success">{q.options[q.correct]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => {
                  setState({
                    questions: [],
                    currentQuestion: 0,
                    selectedAnswers: [],
                    isLoading: true,
                    isFinished: false,
                    score: 0,
                  })
                  loadQuiz()
                }}
                className="px-8 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary hover:shadow-glow-lg transition-all"
              >
                Gör det igen
              </button>
              <Link
                href="/kurser"
                className="px-8 py-3 glass hover:glass-hover rounded-lg font-bold text-neon transition-all text-center"
              >
                Tillbaka till kurser
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = state.questions[state.currentQuestion]
  const progressPercentage = ((state.currentQuestion + 1) / state.questions.length) * 100

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-primary to-secondary/10">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-text-tertiary text-sm">Fråga {state.currentQuestion + 1} av {state.questions.length}</p>
              <p className="text-neon font-semibold text-sm">{progressPercentage.toFixed(0)}% klar</p>
            </div>
            <button
              onClick={() => router.push('/kurser')}
              className="px-3 py-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              ✕ Avsluta
            </button>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentQuestion}
            className="glass-lg p-8 rounded-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <p className="text-xs text-neon font-semibold uppercase mb-2 tracking-wide">
                {currentQ.category}
              </p>
              <h2 className="text-2xl font-bold text-text-primary">{currentQ.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all border-2 flex items-center justify-between group ${
                    state.selectedAnswers[state.currentQuestion] === idx
                      ? 'bg-gradient-to-r from-neon/20 to-accent/20 border-neon text-neon'
                      : 'glass hover:glass-hover border-transparent hover:border-neon/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <span>{option}</span>
                  {state.selectedAnswers[state.currentQuestion] === idx && (
                    <motion.div
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-neon to-accent flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Check size={16} className="text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <button
            onClick={handlePrevious}
            disabled={state.currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 glass hover:glass-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-text-secondary hover:text-neon"
          >
            <ChevronLeft size={20} />
            <span>Föregående</span>
          </button>

          {state.currentQuestion === state.questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={state.selectedAnswers[state.currentQuestion] === null}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-neon to-accent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-lg transition-all text-primary font-semibold disabled:shadow-none"
            >
              <span>Skicka svar</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={state.selectedAnswers[state.currentQuestion] === null}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-neon to-accent rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-lg transition-all text-primary font-semibold disabled:shadow-none"
            >
              <span>Nästa</span>
              <ChevronRight size={20} />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
