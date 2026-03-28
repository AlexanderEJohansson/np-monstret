'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Course {
  id: string
  name: string
  grade_level: string
  subject: string
  description: string
}

export default function KurserPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData?.user)

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('grade_level', { ascending: true })

      setCourses(coursesData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Du måste logga in för att se kurser</p>
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
    return <main className="min-h-screen flex items-center justify-center">Laddar kurser...</main>
  }

  const coursesByLevel = courses.reduce(
    (acc, course) => {
      if (!acc[course.grade_level]) acc[course.grade_level] = []
      acc[course.grade_level].push(course)
      return acc
    },
    {} as Record<string, Course[]>
  )

  const levelLabels: Record<string, string> = {
    åk6: 'År 6',
    åk9: 'År 9',
    gymnasiet: 'Gymnasiet',
  }

  return (
    <main className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-neon">Mina Kurser</h1>
        <p className="text-slate-400 mb-12">Välj en kurs och börja träna</p>

        {Object.entries(coursesByLevel).map(([level, levelCourses]) => (
          <div key={level} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">{levelLabels[level]}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levelCourses.map((course) => (
                <Link key={course.id} href={`/quiz/${course.id}`}>
                  <div className="glass p-6 rounded-xl glow hover:glow-lg transition-smooth cursor-pointer h-full">
                    <h3 className="text-xl font-bold text-neon mb-2">{course.name}</h3>
                    <p className="text-slate-300 mb-4">{course.description}</p>
                    <button className="mt-4 w-full px-4 py-2 bg-neon text-black font-semibold rounded-lg hover:bg-cyan-400 transition">
                      Starta Quiz
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
