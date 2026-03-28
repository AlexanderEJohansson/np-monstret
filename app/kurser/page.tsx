'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { createClient } from '../../lib/supabase'
import LoadingSkeleton from '../../components/LoadingSkeleton'

const ALL_COURSES = [
  { id: 1, name: 'Matematik Åk 6', subject: '📐', grade: 'Åk 6', progress: 0 },
  { id: 2, name: 'Engelska Åk 6', subject: '🇬🇧', grade: 'Åk 6', progress: 0 },
  { id: 3, name: 'Svenska Åk 6', subject: '📝', grade: 'Åk 6', progress: 0 },
  { id: 4, name: 'Historia Åk 6', subject: '🏛️', grade: 'Åk 6', progress: 0 },
  { id: 5, name: 'Matematik Åk 9', subject: '📐', grade: 'Åk 9', progress: 0 },
  { id: 6, name: 'Engelska Åk 9', subject: '🇬🇧', grade: 'Åk 9', progress: 0 },
  { id: 7, name: 'Svenska Åk 9', subject: '📝', grade: 'Åk 9', progress: 0 },
  { id: 8, name: 'Naturkunskap Åk 9', subject: '🔬', grade: 'Åk 9', progress: 0 },
  { id: 9, name: 'Matematik Gym', subject: '📐', grade: 'Gymnasiet', progress: 0 },
  { id: 10, name: 'Engelska Gym', subject: '🇬🇧', grade: 'Gymnasiet', progress: 0 },
  { id: 11, name: 'Svenska Gym', subject: '📝', grade: 'Gymnasiet', progress: 0 },
  { id: 12, name: 'Samhällskunskap Gym', subject: '🌍', grade: 'Gymnasiet', progress: 0 },
]

export default function CoursesPage() {
  const [filter, setFilter] = useState<'all' | 'åk6' | 'åk9' | 'gym'>('all')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    checkUser()
  }, [])

  const filteredCourses = ALL_COURSES.filter((course) => {
    if (filter === 'all') return true
    if (filter === 'åk6') return course.grade === 'Åk 6'
    if (filter === 'åk9') return course.grade === 'Åk 9'
    if (filter === 'gym') return course.grade === 'Gymnasiet'
    return true
  })

  const handleCourseClick = (courseId: number) => {
    if (user) {
      router.push(`/quiz/${courseId}`)
    } else {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text-static">Alla kurser</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Välj en kurs och börja träna. Alla frågor är unika och matchar riktiga nationella prov.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {['all', 'åk6', 'åk9', 'gym'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-neon to-accent text-primary'
                  : 'glass hover:glass-hover text-text-secondary'
              }`}
            >
              {f === 'all' ? 'Alla kurser' : f === 'åk6' ? 'Åk 6' : f === 'åk9' ? 'Åk 9' : 'Gymnasiet'}
            </button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <LoadingSkeleton variant="card" count={12} />
          ) : (
            filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                className="glass-lg p-6 rounded-xl cursor-pointer group relative overflow-hidden"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 3) * 0.1 }}
                onClick={() => handleCourseClick(course.id)}
              >
                {/* Overlay for non-logged-in users */}
                {!user && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                    <div className="text-center">
                      <Lock size={32} className="mx-auto mb-2 text-neon" />
                      <p className="text-white font-semibold text-sm">Logga in för att starta</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Subject Icon */}
                  <div className="text-5xl">{course.subject}</div>

                  {/* Course Name */}
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">{course.name}</h3>
                    <p className="text-xs text-text-tertiary">{course.grade}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-text-tertiary">
                      <span>Framsteg</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon to-accent transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-neon to-accent rounded-lg text-primary font-semibold text-sm hover:shadow-glow-lg transition-all transform group-hover:scale-105">
                    Starta quiz
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Login Prompt */}
        {!user && (
          <motion.div
            className="mt-16 text-center glass-lg rounded-2xl p-12 border-2 border-neon/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 gradient-text-static">Klara för att börja?</h2>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              Registrera dig nu och få tillgång till alla kurser. 7 dagars gratis provperiod, inget kort behövs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary hover:shadow-glow-lg transition-all"
              >
                Kom igång
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 glass hover:glass-hover rounded-lg font-bold text-neon transition-all"
              >
                Logga in istället
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
