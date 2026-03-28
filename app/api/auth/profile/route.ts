import { createClient } from '@/lib/supabase'
import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Hämta inloggad user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = supabaseServer()

    // Kollar om profile redan finns
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({ message: 'Profile already exists' }, { status: 200 })
    }

    // Skapar ny profile
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        display_name: user.email?.split('@')[0] || 'Student',
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Skapar även user_progress-rad
    const { error: progressError } = await supabaseAdmin
      .from('user_progress')
      .insert({
        user_id: user.id,
        total_quizzes: 0,
        avg_score: 0,
        total_xp: 0,
        level: 1,
        streak: 0,
        last_quiz_date: null,
        weaknesses: [],
        created_at: new Date().toISOString(),
      })

    if (progressError) {
      console.error('Progress creation error:', progressError)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
