'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        router.push('/auth/signup')
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.user.id,
          email: userData.user.email,
        }),
      })

      const { sessionUrl } = await response.json()
      if (sessionUrl) {
        window.location.href = sessionUrl
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-neon">Priser</h1>
          <p className="text-slate-400">Välj den plan som passar dig bäst</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-2">Gratis Provperiod</h2>
            <p className="text-slate-400 mb-6">7 dagar</p>
            <p className="text-4xl font-bold text-neon mb-6">0 kr</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Alla 12 kurser
              </li>
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Obegränsat antal quiz
              </li>
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Adaptiv träning
              </li>
              <li className="flex items-center text-slate-500">
                <span className="mr-2">✗</span> Avancerade rapporter
              </li>
            </ul>
            <Link href="/auth/signup">
              <button className="w-full px-6 py-3 text-lg bg-secondary text-white font-semibold rounded-lg hover:bg-slate-700 transition">
                Börja Gratis
              </button>
            </Link>
          </div>

          <div className="glass p-8 rounded-2xl border-2 border-neon glow-lg">
            <h2 className="text-2xl font-bold mb-2">Premium</h2>
            <p className="text-slate-400 mb-6">Sedan 7 dagar</p>
            <p className="text-4xl font-bold text-neon mb-6">
              99 kr <span className="text-lg text-slate-400">/mån</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Alla 12 kurser
              </li>
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Obegränsat antal quiz
              </li>
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Adaptiv träning
              </li>
              <li className="flex items-center">
                <span className="text-neon mr-2">✓</span> Avancerade rapporter
              </li>
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-3 text-lg bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition disabled:opacity-50"
            >
              {loading ? 'Laddar...' : 'Köp Nu'}
            </button>
          </div>
        </div>

        <div className="mt-12 glass p-8 rounded-xl text-center">
          <p className="text-slate-400 mb-4">Frågor?</p>
          <p className="text-white">Kontakta support@npmonstret.se</p>
        </div>
      </div>
    </main>
  )
}
