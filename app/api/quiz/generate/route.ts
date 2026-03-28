import { NextRequest, NextResponse } from 'next/server'

const generateQuestions = async (courseId: string, weaknesses?: string[]) => {
  const questions = [
    {
      question: 'Vilket ord är stavat korrekt?',
      options: ['konsekvenss', 'konsekvens', 'konsekventz', 'konsekwens'],
      correctAnswer: 1,
      explanation: 'Ordet "konsekvens" är stavat korrekt enligt svensk stavning.',
      topic: 'Stavning',
      difficulty: 'medium',
    },
    {
      question: 'Vad är 15 × 7?',
      options: ['105', '112', '120', '98'],
      correctAnswer: 0,
      explanation: '15 × 7 = 105',
      topic: 'Multiplikation',
      difficulty: 'easy',
    },
    {
      question: 'Translate to Swedish: "I have already finished my homework"',
      options: [
        'Jag har redan gjort min läxor',
        'Jag redan gjorde mina läxor',
        'Jag har redan gjort mina läxor',
        'Jag gör redan min läxor',
      ],
      correctAnswer: 2,
      explanation: 'Korrekt användning av perfekt tempus och pluralform.',
      topic: 'Verb & Grammatik',
      difficulty: 'medium',
    },
    {
      question: 'Vad kallas en linje som förenar två hörn i en polygon men inte är en sida?',
      options: ['Kant', 'Diagonal', 'Höjd', 'Medialn'],
      correctAnswer: 1,
      explanation: 'En diagonal är en linje som förenar två icke-intilliggande hörn.',
      topic: 'Geometri',
      difficulty: 'medium',
    },
    {
      question: 'Vilket pronomen hör hemma här? "Det är _____ som gör detta."',
      options: ['mig', 'jag', 'mina', 'min'],
      correctAnswer: 1,
      explanation: 'Efter "som" användes subjektspronomen "jag".',
      topic: 'Grammatik',
      difficulty: 'medium',
    },
    {
      question: 'What is the opposite of "happy"?',
      options: ['Sad', 'Angry', 'Tired', 'Bored'],
      correctAnswer: 0,
      explanation: 'Sad is the most direct opposite of happy.',
      topic: 'Vocabulary',
      difficulty: 'easy',
    },
    {
      question: 'Vilket växtorgan är huvudsakligen ansvarigt för gasutbyte?',
      options: ['Rot', 'Stam', 'Blad', 'Blomma'],
      correctAnswer: 2,
      explanation: 'Bladen är huvudorganen för fotosyntesi och gasutbyte.',
      topic: 'Biologi',
      difficulty: 'medium',
    },
    {
      question: 'How do you form the past tense of irregular verbs in English?',
      options: [
        'Add -ed to the base form',
        'Memorize unique forms',
        'Change the vowel sound',
        'Use "have" + past participle',
      ],
      correctAnswer: 1,
      explanation: 'Irregular verbs have unique past tense forms that must be memorized.',
      topic: 'Grammar',
      difficulty: 'medium',
    },
    {
      question: 'Vilken är Sveriges största sjö till ytan?',
      options: ['Vänern', 'Vättern', 'Mälaren', 'Siljan'],
      correctAnswer: 0,
      explanation: 'Vänern är Sveriges största sjö med en area på cirka 5 200 km².',
      topic: 'Geografi',
      difficulty: 'easy',
    },
    {
      question: 'Solve: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 1,
      explanation: '2x = 8, therefore x = 4',
      topic: 'Algebra',
      difficulty: 'easy',
    },
    {
      question: 'Vilken amerikansk president avskaffade slaveriet?',
      options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'Andrew Johnson'],
      correctAnswer: 2,
      explanation: 'Abraham Lincoln utfärdade Emancipationsproclametionen 1863.',
      topic: 'Historia',
      difficulty: 'medium',
    },
    {
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correctAnswer: 2,
      explanation: 'Canberra är huvudstaden i Australien.',
      topic: 'Geografi',
      difficulty: 'easy',
    },
  ]

  return questions
}

export async function POST(request: NextRequest) {
  try {
    const { courseId, userId, weaknesses } = await request.json()

    const questions = await generateQuestions(courseId, weaknesses)

    return NextResponse.json({
      quiz: {
        id: `quiz_${Date.now()}`,
        courseId,
        questions,
        startedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
