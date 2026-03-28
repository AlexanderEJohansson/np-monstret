'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react'
import confetti from 'canvas-confetti'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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
  startTime: number
}

export default function QuizPage() {
  const params = useParams()
  const courseId = params.courseId
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    selectedAnswers: [],
    isLoading: true,
    isFinished: false,
    score: 0,
    startTime: Date.now(),
  })

  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    loadQuiz()
  }, [courseId])

  // Timer
  useEffect(() => {
    if (state.isFinished || state.isLoading) return
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - state.startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [state.startTime, state.isFinished, state.isLoading])

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
        startTime: Date.now(),
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (state.isFinished || state.isLoading) return

      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (idx < state.questions[state.currentQuestion]?.options.length) {
          handleSelectAnswer(idx)
        }
      } else if (e.key === 'Enter') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [state])

  const finishQuiz = async () => {
    let score = 0
    const missedCategories: { [key: string]: number } = {}

    state.selectedAnswers.forEach((answer, idx) => {
      const q = state.questions[idx]
      if (answer === q.correct) {
        score++
      } else {
        missedCategories[q.category] = (missedCategories[q.category] || 0) + 1
      }
    })

    const scorePercentage = Math.round((score / state.questions.length) * 100)

    // Trigger confetti
    if (scorePercentage > 90) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      })
    } else if (scorePercentage > 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Spara till Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Spara quiz-resultat
        await supabase.from('quizzes').insert({
          user_id: user.id,
          course_id: courseId,
          course_name: 'Quiz',
          score: scorePercentage,
          completed_at: new Date().toISOString(),
        })

        // Uppdatera user_progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (progress) {
          const newXp = progress.total_xp + scorePercentage
          const weaknesses = Object.keys(missedCategories).sort(
            (a, b) => missedCategories[b] - missedCategories[a]
          )

          await supabase
            .from('user_progress')
            .update({
              total_quizzes: progress.total_quizzes + 1,
              avg_score:
                (progress.avg_score * progress.total_quizzes + scorePercentage) /
                (progress.total_quizzes + 1),
              total_xp: newXp,
              weaknesses: weaknesses.slice(0, 3),
              last_quiz_date: new Date().toISOString(),
            })
            .eq('user_id', user.id)
        }
      }
    } catch (error) {
      console.error('Error saving quiz:', error)
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
    const isOutstanding = scorePercentage >= 90
    const isGood = scorePercentage >= 70
    const isOkay = scorePercentage >= 50

    let feedback = isPerfect
      ? '🏆 PERFEKT! Du är en riktig NP-Monster! 🤖'
      : isOutstanding
      ? '🏆 OUTSTANDING! Du är bäst! 💫'
      : isGood
      ? '🎉 Bra jobbat! Du är på rätt väg 🚀'
      : isOkay
      ? '👍 Du är på väg! Fortsätt träna 💪'
      : '💪 Övning ger färdighet – försök igen!'

    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-primary to-secondary/10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated Score Circle */}
            <motion.svg
              className="w-48 h-48 mx-auto"
              viewBox="0 0 200 200"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(0, 240, 255, 0.2)"
                strokeWidth="8"
              />

              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="565.48"
                strokeDashoffset="565.48"
                animate={{
                  strokeDashoffset: 565.48 * (1 - scorePercentage / 100),
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Gradient */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#ff00aa" />
                </linearGradient>
              </defs>

              {/* Text */}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                fontSize="48"
                fontWeight="900"
                fill="#00f0ff"
              >
                {scorePercentage}%
              </text>
              <text
                x="100"
                y="125"
                textAnchor="middle"
                fontSize="12"
                fill="rgba(148, 163, 184, 0.7)"
              >
                {state.score} av {state.questions.length} rätt
              </text>
            </motion.svg>

            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-black bg-gradient-to-r from-neon to-accent bg-clip-text text-transparent mb-2">
                {feedback}
              </h1>
              <p className="text-text-secondary text-lg">
                {isGood
                  ? 'Du är väl förberedd för provet! Vill du träna på något annat?'
                  : isOkay
                  ? 'Du är på rätt väg! Träna lite till så blir du ännu bättre.'
                  : 'Ingen panik – det tog alla tid att lära sig. Försök igen!'}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="glass-lg p-4 rounded-lg">
                <p className="text-text-tertiary text-sm">Tid</p>
                <p className="text-2xl font-bold text-neon">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</p>
              </div>
              <div className="glass-lg p-4 rounded-lg">
                <p className="text-text-tertiary text-sm">Rätt</p>
                <p className="text-2xl font-bold text-success">{state.score}</p>
              </div>
              <div className="glass-lg p-4 rounded-lg">
                <p className="text-text-tertiary text-sm">XP+</p>
                <p className="text-2xl font-bold text-accent">+{scorePercentage}</p>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              className="glass-lg p-8 rounded-2xl space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-text-primary text-left">Dina svar:</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.questions.map((q, idx) => {
                  const isCorrect = state.selectedAnswers[idx] === q.correct
                  return (
                    <motion.div
                      key={idx}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'bg-success/10 border-success/30'
                          : 'bg-danger/10 border-danger/30'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-1 flex-shrink-0 ${
                            isCorrect ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {isCorrect ? <Check size={20} /> : <X size={20} />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-text-primary text-sm mb-1">
                            {q.question}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            Din svar:{' '}
                            <span className={isCorrect ? 'text-success' : 'text-danger'}>
                              {q.options[state.selectedAnswers[idx]!]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-xs text-text-tertiary">
                              Rätt svar:{' '}
                              <span className="text-success">{q.options[q.correct]}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
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
                    startTime: Date.now(),
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-primary to-secondary/10">
      <div className="max-w-2xl mx-auto">
        {/* Header with Timer */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-text-tertiary text-sm">
                Fråga {state.currentQuestion + 1} av {state.questions.length}
              </p>
              <p className="text-neon font-semibold text-sm">{progressPercentage.toFixed(0)}% klar</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-text-tertiary">
                <Clock size={18} />
                <span className="text-sm font-semibold">{formatTime(elapsedTime)}</span>
              </div>
              <button
                onClick={() => router.push('/kurser')}
                className="px-3 py-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
              >
                ✕ Avsluta
              </button>
            </div>
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
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-neon font-semibold uppercase mb-2 tracking-wide px-3 py-1 bg-neon/10 rounded-full w-fit">
                  {currentQ.category}
                </p>
                <p className="text-xs text-text-tertiary">Fråga {state.currentQuestion + 1} av {state.questions.length}</p>
              </div>
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
                  title={`Tryck ${idx + 1} på tangentbordet`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-text-tertiary group-hover:text-neon transition-colors">
                      {idx + 1}
                    </span>
                    <span>{option}</span>
                  </div>
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

            <p className="text-xs text-text-tertiary text-center">
              💡 Tips: Använd sifferknapparna (1-4) för att svara snabbare! Tryck Enter för nästa.
            </p>
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
