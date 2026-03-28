'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '../../../lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken långt')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      router.push('/auth/verify-email')
    } catch (err: any) {
      setError(err.message || 'Något gick fel vid registrering')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-primary to-secondary/20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Card */}
        <div className="glass-lg p-8 rounded-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-neon to-accent rounded-lg mb-4">
              <span className="text-2xl font-bold text-primary">NM</span>
            </div>
            <h1 className="text-3xl font-black gradient-text-static">Kom igång</h1>
            <p className="text-text-tertiary">Bli en NP-Monster redan idag! 🚀</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-danger/20 border border-danger/50 rounded-lg p-4 flex items-start space-x-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-danger mt-1">⚠️</div>
              <div>
                <p className="font-semibold text-danger text-sm">Något gick fel</p>
                <p className="text-danger/80 text-xs mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">E-postadress</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din.email@exempel.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-neon/20 rounded-lg focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                />
              </div>
              <p className="text-xs text-text-tertiary">Vi skickar ingen spam, bara viktiga uppdateringar</p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 6 tecken"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-secondary/50 border border-neon/20 rounded-lg focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-neon transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary">Bekräfta lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Upprepa lösenordet"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-secondary/50 border border-neon/20 rounded-lg focus:border-neon focus:ring-2 focus:ring-neon/20 outline-none transition-all text-text-primary placeholder:text-text-tertiary"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start space-x-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-5 h-5 mt-0.5 rounded bg-secondary/50 border border-neon/20 accent-neon cursor-pointer"
              />
              <span className="text-text-tertiary">
                Jag godkänner{' '}
                <Link href="#" className="text-neon hover:text-neon-light transition-colors">
                  villkoren
                </Link>{' '}
                och{' '}
                <Link href="#" className="text-neon hover:text-neon-light transition-colors">
                  integritetspolicyn
                </Link>
              </span>
            </label>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary hover:shadow-glow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Registrerar...</span>
                </>
              ) : (
                <span>Registrera mig</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center space-x-3">
            <div className="h-px bg-neon/10 flex-1"></div>
            <span className="text-text-tertiary text-xs">eller</span>
            <div className="h-px bg-neon/10 flex-1"></div>
          </div>

          {/* Social Signup (Coming Soon) */}
          <button
            disabled
            className="w-full py-3 glass hover:glass-hover rounded-lg font-semibold text-text-secondary transition-all opacity-50 cursor-not-allowed"
          >
            Registrera med Google (snart)
          </button>

          {/* Footer */}
          <div className="pt-4 border-t border-neon/10">
            <p className="text-center text-text-tertiary text-sm">
              Redan registrerad?{' '}
              <Link href="/auth/login" className="text-neon hover:text-neon-light font-semibold transition-colors">
                Logga in här
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="pt-4 space-y-2 text-xs text-text-tertiary">
            <p className="flex items-center space-x-2">
              <span>✓</span>
              <span>7 dagars gratis provperiod</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>✓</span>
              <span>Ingen kreditkort behövs</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>✓</span>
              <span>Avbryt när som helst</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
