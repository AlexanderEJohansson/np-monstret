'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react'
import { createClient } from '../../lib/supabase'
import LoadingSkeleton from '../../components/LoadingSkeleton'

// Fake data for demo
const DEMO_SCORES = [
  { name: 'Dag 1', score: 65 },
  { name: 'Dag 2', score: 72 },
  { name: 'Dag 3', score: 68 },
  { name: 'Dag 4', score: 78 },
  { name: 'Dag 5', score: 82 },
  { name: 'Dag 6', score: 85 },
  { name: 'Dag 7', score: 88 },
]

const DEMO_RECENT_QUIZZES = [
  { id: 1, course: 'Matematik Åk 9', score: 88, date: '2024-03-28', percentage: 88 },
  { id: 2, course: 'Engelska Åk 9', score: 82, date: '2024-03-27', percentage: 82 },
  { id: 3, course: 'Svenska Åk 9', score: 85, date: '2024-03-26', percentage: 85 },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
      setIsLoading(false)
    }
    checkAuth()
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
          <h1 className="text-5xl md:text-6xl font-black mb-2 gradient-text-static">Hej, {userName}! 👋</h1>
          <p className="text-text-secondary text-lg">Så går det i din träning</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Trophy, label: 'Quiz genomförda', value: '12', color: 'from-yellow-500 to-yellow-600' },
            { icon: TrendingUp, label: 'Ditt snitt', value: '82%', color: 'from-green-500 to-emerald-600' },
            { icon: Flame, label: 'Streak', value: '7 dagar', color: 'from-red-500 to-orange-600' },
            { icon: Target, label: 'Nivå', value: 'Expert', color: 'from-purple-500 to-violet-600' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                className={`glass-lg p-6 rounded-xl bg-gradient-to-br ${stat.color}/10 border border-${stat.color.split('-')[1]}/20`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-text-primary">{stat.value}</p>
                  </div>
                  <Icon className={`w-12 h-12 text-neon opacity-30`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Score Trend */}
          <motion.div
            className="glass-lg p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Dina framsteg</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DEMO_SCORES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid #00BFFF',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="score" stroke="#00BFFF" strokeWidth={3} dot={{ fill: '#00BFFF', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Performance */}
          <motion.div
            className="glass-lg p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">Ämnen</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Matematik', score: 88 },
                { name: 'Engelska', score: 82 },
                { name: 'Svenska', score: 85 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid #00BFFF',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="score" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Quizzes */}
        <motion.div
          className="glass-lg p-8 rounded-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Senaste quiz</h2>
            <Link href="/kurser" className="text-neon hover:text-neon-light transition-colors text-sm font-semibold">
              Se fler →
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_RECENT_QUIZZES.map((quiz, idx) => (
              <motion.div
                key={quiz.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <div>
                  <p className="font-semibold text-text-primary">{quiz.course}</p>
                  <p className="text-xs text-text-tertiary">{quiz.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-neon/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-neon">{quiz.percentage}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

          <div className="glass-lg p-8 rounded-xl text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-text-primary mb-1">Håll streaken</h3>
            <p className="text-text-tertiary">Du är på 7 dagars streak! 🔥</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
