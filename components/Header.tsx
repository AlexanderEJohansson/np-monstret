'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="bg-primary border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-neon">
          NP-Monstret
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/kurser" className="text-white hover:text-neon transition">
            Kurser
          </Link>
          <Link href="/dashboard" className="text-white hover:text-neon transition">
            Dashboard
          </Link>
        </nav>
        <div className="flex gap-2">
          {user ? (
            <>
              <span className="text-white text-sm py-2 px-4">{user.email}</span>
              <button onClick={handleLogout} className="px-3 py-2 text-sm border border-neon text-neon rounded-lg hover:bg-neon/10 transition">
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-3 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-slate-700 transition">
                  Logga in
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-3 py-2 text-sm bg-neon text-black rounded-lg hover:bg-cyan-400 transition">
                  Registrera
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
