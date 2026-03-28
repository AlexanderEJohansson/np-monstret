'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
        },
      })
      if (signupError) throw signupError
      router.push('/auth/verify-email')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-neon">Registrera</h1>
        <p className="text-slate-400 mb-6">7 dagars gratis provperiod</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Namn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-neon"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-neon"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-neon"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-black py-2.5 rounded-lg font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
          >
            {loading ? 'Registrerar...' : 'Registrera'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          Redan medlem?{' '}
          <Link href="/auth/login" className="text-neon hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </main>
  )
}
