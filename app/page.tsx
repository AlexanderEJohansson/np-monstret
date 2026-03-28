'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user)
    }
    getUser()
  }, [])

  return (
    <main className="bg-primary text-white">
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Träna på
            <span className="text-neon"> Nationella Prov</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Dynamiskt genererade prov i Matematik, Engelska och Svenska för åk 6 – gymnasiet
          </p>
          <div className="flex gap-4 justify-center mb-16">
            {user ? (
              <>
                <Link href="/kurser">
                  <button className="px-6 py-3 text-lg bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                    Starta träning
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="px-6 py-3 text-lg bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition">
                    Min Dashboard
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <button className="px-6 py-3 text-lg bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                    Gratis Provperiod
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="px-6 py-3 text-lg bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition">
                    Logga In
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="glass p-6 rounded-xl glow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Genererade Frågor</h3>
              <p className="text-slate-300">Varje quiz är helt unikt och genereras i realtid av AI</p>
            </div>
            <div className="glass p-6 rounded-xl glow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Adaptiv Träning</h3>
              <p className="text-slate-300">Systemet anpassar sig efter dina svagheter automatiskt</p>
            </div>
            <div className="glass p-6 rounded-xl glow">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Skolverkets Format</h3>
              <p className="text-slate-300">Frågorna följer exakt samma format som riktiga prov</p>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-10">12 Kurser Att Välja Från</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Åk 6', 'Åk 9', 'Gymn Nivå 1', 'Gymn Nivå 2'].map((level) => (
                <div key={level} className="glass p-4 rounded-lg text-center">
                  <p className="font-semibold text-neon">{level}</p>
                  <p className="text-sm text-slate-400">3-4 kurser</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 mb-20">
            <h2 className="text-3xl font-bold mb-10">Enkelt och Transparent</h2>
            <div className="glass p-12 rounded-2xl max-w-md mx-auto glow-lg">
              <p className="text-5xl font-bold text-neon mb-4">99 kr</p>
              <p className="text-lg text-slate-300 mb-8">/månad</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center"><span className="text-neon mr-3">✓</span> Alla 12 kurser</li>
                <li className="flex items-center"><span className="text-neon mr-3">✓</span> Obegränsat antal quiz</li>
                <li className="flex items-center"><span className="text-neon mr-3">✓</span> Framåtskridande spåring</li>
                <li className="flex items-center"><span className="text-neon mr-3">✓</span> 7 dagars gratis prov</li>
              </ul>
              {user ? (
                <Link href="/kurser">
                  <button className="w-full px-6 py-3 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                    Börja Nu
                  </button>
                </Link>
              ) : (
                <Link href="/auth/signup">
                  <button className="w-full px-6 py-3 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                    Börja Gratis Prov
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
