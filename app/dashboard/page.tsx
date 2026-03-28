'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user)

      if (userData?.user) {
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select('*')
          .eq('user_id', userData.user.id)

        const totalQuizzes = quizzesData?.length || 0
        const avgScore = quizzesData?.length
          ? (quizzesData.reduce((sum: number, q: any) => sum + (q.score || 0), 0) / quizzesData.length).toFixed(1)
          : 0

        setStats({
          totalQuizzes,
          avgScore,
          charText: `Du har genomfört ${totalQuizzes} quiz med en genomsnittlig poäng på ${avgScore}%`,
        })
      }
      setLoading(false)
    }

    loadData()
  }, [])

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Du måste logga in för att se dashboard</p>
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
              Logga In
            </button>
          </Link>
        </div>
      </main>
    )
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Laddar dashboard...</main>
  }

  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neon mb-4">Min Dashboard</h1>
        <p className="text-slate-400 mb-12">Hej, {user.email}!</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 rounded-xl glow">
            <p className="text-slate-400 text-sm mb-2">Totalt Quiz Genomförda</p>
            <p className="text-4xl font-bold text-neon">{stats?.totalQuizzes || 0}</p>
          </div>
          <div className="glass p-6 rounded-xl glow">
            <p className="text-slate-400 text-sm mb-2">Genomsnittligt Resultat</p>
            <p className="text-4xl font-bold text-neon">{stats?.avgScore || 0}%</p>
          </div>
          <div className="glass p-6 rounded-xl glow">
            <p className="text-slate-400 text-sm mb-2">Status</p>
            <p className="text-lg font-bold text-neon">Aktiv</p>
          </div>
        </div>

        <div className="glass p-6 rounded-xl mb-12">
          <p className="text-slate-300">{stats?.charText}</p>
        </div>

        <div className="flex gap-4">
          <Link href="/kurser">
            <button className="px-6 py-3 text-lg bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
              Fortsätt Träna
            </button>
          </Link>
          <Link href="/pricing">
            <button className="px-6 py-3 text-lg bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition">
              Prenumeration
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
