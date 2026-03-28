'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { createClient } from '../lib/supabase'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // Close menu on route change
    setIsOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setIsDropdownOpen(false)
  }

  const getUserName = (email?: string) => {
    if (!email) return 'Student'
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getInitial = (email?: string) => {
    const name = getUserName(email)
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-primary/80 border-b border-neon/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-neon to-accent rounded-lg flex items-center justify-center font-bold text-primary glow transform group-hover:scale-110 transition-transform">
              NM
            </div>
            <span className="text-xl font-bold gradient-text-static hidden sm:inline">NP-Monstret</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/kurser" className="text-text-secondary hover:text-neon transition-colors">
              Kurser
            </Link>
            {user && (
              <Link href="/dashboard" className="text-text-secondary hover:text-neon transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/pricing" className="text-text-secondary hover:text-neon transition-colors">
              Priser
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg glass hover:glass-hover transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-neon to-accent rounded-full flex items-center justify-center text-sm font-bold text-primary">
                    {getInitial(user.email)}
                  </div>
                  <span className="text-sm font-medium text-text-secondary">{getUserName(user.email)}</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden animate-slide-down">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-secondary/50 transition-colors text-text-secondary hover:text-neon"
                    >
                      Min dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-secondary/50 transition-colors text-text-secondary hover:text-danger flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logga ut</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-text-secondary hover:text-neon transition-colors"
                >
                  Logga in
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-neon to-accent rounded-lg font-semibold text-primary hover:shadow-glow-lg transition-all"
                >
                  Kom igång
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg glass hover:glass-hover transition-all"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-lg border-t border-neon/10 animate-slide-down">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/kurser"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-text-secondary hover:text-neon"
            >
              Kurser
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-text-secondary hover:text-neon"
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-text-secondary hover:text-neon"
            >
              Priser
            </Link>

            <div className="border-t border-neon/10 pt-3 mt-3">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-neon mb-2">
                    Hej, {getUserName(user.email)}! 👋
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-danger flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logga ut</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-text-secondary hover:text-neon text-center"
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-neon to-accent rounded-lg font-semibold text-primary text-center"
                  >
                    Kom igång
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
