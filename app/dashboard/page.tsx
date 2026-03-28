'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Flame, Trophy, Target, TrendingUp, Zap } from 'lucide-react'
import { createClient } from '../../lib/supabase'
import LoadingSkeleton from '../../components/LoadingSkeleton'

interface UserProgress {
  total_quizzes: number
  avg_score: number
  total_xp: number
  level: number
  streak: number
  weaknesses: string[]
}

interface RecentQuiz {
  id: string
  course_name: string
  score: number
  created_at: string
}

const LEVEL_NAMES = {
  1: 'Nybörjare',
  2: 'Lansen',
  3: 'Riddaren',
  4: 'Mästare',
  5: 'NP-Monster',
}

const getLevel = (xp: number) => {
  if (xp < 100) return 1
  if (xp < 300) return 2
  if (xp < 600) return 3
  if (xp < 1000) return 4
  return 5
}

const getXpForLevel = (level: number) => {
  const thresholds = [0, 100, 300, 600, 1000]
  return thresholds[level - 1] || 0
}

const getXpToNextLevel = (xp: number) => {
  const thresholds = [100, 300, 600, 1000, Infinity]
  const currentLevel = getLevel(xp)
  return thresholds[currentLevel - 1]
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([])
  const [scoreHistory, setScoreHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }
        setUser(authUser)

        // Hämta user_progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        if (progressData) {
          setProgress(progressData)
        } else {
          // Om ingen progress finns, skapa den
          await fetch('/api/auth/profile', { method: 'POST' })
          // Försök hämta igen
          const { data: newProgressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', authUser.id)
            .single()
          if (newProgressData) setProgress(newProgressData)
        }

        // Hämta senaste quiz-resultat
        const { data: quizzes } = await supabase
          .from('quizzes')
          .select('id, course_name, score, created_at')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5)

        if (quizzes) {
          setRecentQuizzes(quizzes)
          // Skapa score history för chart
          const history = quizzes
            .reverse()
            .map((q, i) => ({
              name: `Quiz ${i + 1}`,
              score: q.score || 0,
            }))
          setScoreHistory(history)
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton variant="text" count={3} height="h-8" className="mb-6" />
          <LoadingSkeleton variant="card" count={6} height="h-40" />
        </div>
      </div>
    )
  }

  const userName = user?.email?.split('@')[0] || 'Student'
  const currentLevel = progress ? getLevel(progress.total_xp) : 1
  const levelName = LEVEL_NAMES[currentLevel as keyof typeof LEVEL_NAMES]
  const xpInCurrentLevel = progress?.total_xp || 0 - getXpForLevel(currentLevel)
  const xpToNextLevel = getXpToNextLevel(progress?.total_xp || 0) - getXpForLevel(currentLevel)
  const xpProgress = ((xpInCurrentLevel) / xpToNextLevel) * 100

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-primary to-secondary/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-neon to-accent bg-clip-text text-transparent">
            Hej, {userName}! 👋
          </h1>
          <p className="text-text-secondary text-lg">Så går det i din träning</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Level Card */}
          <motion.div
            className="glass-lg p-6 rounded-xl bg-gradient-to-br from-neon/10 to-accent/10 border border-neon/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-tertiary text-sm mb-1">Din nivå</p>
                <p className="text-2xl font-black bg-gradient-to-r from-neon to-accent bg-clip-text text-transparent">
                  {levelName}
                </p>
                <p className="text-xs text-text-tertiary mt-1">Level {currentLevel}</p>
              </div>
              <Zap className="w-12 h-12 text-neon opacity-30" />
            </div>
          </motion.div>

          {/* XP Card */}
          <motion.div
            className="glass-lg p-6 rounded-xl bg-gradient-to-br from-neon/10 to-secondary/10 border border-neon/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-tertiary text-sm mb-1">Total XP</p>
                <p className="text-3xl font-black text-neon">{progress?.total_xp || 0}</p>
                <p className="text-xs text-text-tertiary mt-1">{Math.round(xpProgress)}% till nästa level</p>
              </div>
              <Trophy className="w-12 h-12 text-neon opacity-30" />
            </div>
            {/* XP Progress Bar */}
            <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon to-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(xpProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Quiz Stats */}
          <motion.div
            className="glass-lg p-6 rounded-xl bg-gradient-to-br from-accent/10 to-neon/10 border border-accent/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-tertiary text-sm mb-1">Quiz genomförda</p>
                <p className="text-3xl font-black text-accent">{progress?.total_quizzes || 0}</p>
                <p className="text-xs text-text-tertiary mt-1">Snitt: {progress?.avg_score || 0}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-accent opacity-30" />
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            className="glass-lg p-6 rounded-xl bg-gradient-to-br from-warning/10 to-accent/10 border border-warning/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-tertiary text-sm mb-1">Din streak</p>
                <p className="text-3xl font-black text-warning">{progress?.streak || 0}</p>
                <p className="text-xs text-text-tertiary mt-1">dagars streck</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Flame className="w-12 h-12 text-warning opacity-30" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Weakness Tags */}
        {progress?.weaknesses && progress.weaknesses.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-3">Din svaghetsanalys 💪</h3>
            <div className="flex flex-wrap gap-2">
              {progress.weaknesses.map((weakness, idx) => (
                <motion.span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm font-semibold bg-danger/20 border border-danger/30 text-danger"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  {weakness}
                </motion.span>
              ))}
            </div>
            <p className="text-text-tertiary text-sm mt-2">
              Du blir starkare på dessa områden! 🚀
            </p>
          </motion.div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Score Trend */}
          {scoreHistory.length > 0 && (
            <motion.div
              className="glass-lg p-8 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">Dina framsteg</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10, 10, 10, 0.9)',
                      border: '1px solid #00f0ff',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#00f0ff"
                    strokeWidth={3}
                    dot={{ fill: '#00f0ff', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Empty State */}
          {scoreHistory.length === 0 && (
            <motion.div
              className="glass-lg p-8 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-text-tertiary mb-4">Inget quiz ännu! 📊</p>
              <Link href="/kurser" className="text-neon font-semibold hover:text-accent transition-colors">
                Börja träna →
              </Link>
            </motion.div>
          )}
        </div>

        {/* Recent Quizzes */}
        {recentQuizzes.length > 0 && (
          <motion.div
            className="glass-lg p-8 rounded-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Senaste quiz</h2>
              <Link href="/kurser" className="text-neon hover:text-accent transition-colors text-sm font-semibold">
                Se fler →
              </Link>
            </div>

            <div className="space-y-3">
              {recentQuizzes.map((quiz, idx) => (
                <motion.div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <div>
                    <p className="font-semibold text-text-primary">{quiz.course_name}</p>
                    <p className="text-xs text-text-tertiary">
                      {new Date(quiz.created_at).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-neon/20 to-accent/20 flex items-center justify-center">
                    <span className="text-2xl font-black text-neon">{quiz.score || 0}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/kurser"
            className="glass-lg p-8 rounded-xl hover:glass-hover transition-all transform hover:scale-105 cursor-pointer text-center"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-bold text-text-primary mb-1">Fortsätt träna</h3>
            <p className="text-text-tertiary">Gör ett nytt quiz på en annan kurs</p>
          </Link>

          {progress?.streak === 0 ? (
            <Link
              href="/kurser"
              className="glass-lg p-8 rounded-xl hover:glass-hover transition-all transform hover:scale-105 cursor-pointer text-center"
            >
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold text-text-primary mb-1">Starta din streak</h3>
              <p className="text-text-tertiary">Gör ett quiz idag för att börja!</p>
            </Link>
          ) : (
            <div className="glass-lg p-8 rounded-xl text-center">
              <motion.div
                className="text-4xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <h3 className="text-xl font-bold text-text-primary mb-1">Du håller streaken!</h3>
              <p className="text-text-tertiary">Fortsätt så där! {progress.streak} dagar i rad</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
