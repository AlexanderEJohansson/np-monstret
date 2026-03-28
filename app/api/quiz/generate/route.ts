import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// ===== COMPREHENSIVE QUESTION BANKS =====
const QUESTION_BANKS: Record<string, Record<string, any[]>> = {
  'matematik-ak6': {
    questions: [
      { id: 1, question: 'Vad är 25 + 37?', options: ['52', '62', '72', '82'], correct: 0, category: 'aritmetik' },
      { id: 2, question: 'Vilket tal är störst?', options: ['0.5', '0.05', '0.505', '0.050'], correct: 2, category: 'decimaler' },
      { id: 3, question: 'Hur många minuter är 2 timmar och 30 minuter?', options: ['90', '120', '150', '180'], correct: 2, category: 'tid' },
      { id: 4, question: 'Vad är hälften av 84?', options: ['42', '41', '43', '44'], correct: 0, category: 'aritmetik' },
      { id: 5, question: '3/4 av 20 är?', options: ['12', '15', '18', '20'], correct: 1, category: 'bråk' },
      { id: 6, question: 'En låda har längden 10 cm och bredden 5 cm. Vad är omkretsen?', options: ['30 cm', '50 cm', '15 cm', '25 cm'], correct: 0, category: 'geometri' },
      { id: 7, question: 'Vad är 12 × 8?', options: ['86', '96', '106', '116'], correct: 1, category: 'multiplikation' },
      { id: 8, question: 'En boll kostar 150 kr. Två bollar kostar?', options: ['300 kr', '225 kr', '275 kr', '325 kr'], correct: 0, category: 'problemlösning' },
      { id: 9, question: 'Hur många gram är 3 kg?', options: ['300 g', '3000 g', '30 g', '30000 g'], correct: 1, category: 'enheter' },
      { id: 10, question: 'Vad är 100 - 47?', options: ['53', '63', '43', '73'], correct: 0, category: 'subtraktion' },
      { id: 11, question: 'En triangle har vinklarna 60° och 70°. Vad är den tredje vinkeln?', options: ['50°', '40°', '60°', '70°'], correct: 0, category: 'geometri' },
      { id: 12, question: '2/3 är lika med?', options: ['0.33', '0.50', '0.67', '0.75'], correct: 2, category: 'bråk' },
      { id: 13, question: 'Vad är 9 × 9?', options: ['72', '81', '90', '99'], correct: 1, category: 'multiplikation' },
      { id: 14, question: 'En mil är?', options: ['100 m', '1000 m', '10000 m', '100000 m'], correct: 1, category: 'enheter' },
      { id: 15, question: 'Vilket är ett primtal?', options: ['4', '6', '7', '8'], correct: 2, category: 'tal' },
      { id: 16, question: 'Vad är 56 ÷ 7?', options: ['7', '8', '9', '10'], correct: 1, category: 'division' },
      { id: 17, question: 'En cirkel med radie 5 cm har omkretsen?', options: ['10π cm', '25π cm', '5π cm', '15π cm'], correct: 0, category: 'geometri' },
      { id: 18, question: '1/2 + 1/4 är?', options: ['3/4', '1/3', '2/3', '1/6'], correct: 0, category: 'bråk' },
      { id: 19, question: 'Vad är 15% av 200?', options: ['20', '25', '30', '35'], correct: 2, category: 'procent' },
      { id: 20, question: 'En rektangel med längd 8 cm och bredd 3 cm har arean?', options: ['11 cm²', '22 cm²', '24 cm²', '16 cm²'], correct: 2, category: 'geometri' },
      { id: 21, question: 'Vad är 102?', options: ['10', '20', '100', '200'], correct: 2, category: 'potenser' },
      { id: 22, question: '3 + 3 + 3 + 3 är?', options: ['9', '12', '15', '18'], correct: 1, category: 'addition' },
      { id: 23, question: 'Vilket är minsta gemensamma flera av 4 och 6?', options: ['12', '24', '18', '10'], correct: 0, category: 'tal' },
      { id: 24, question: 'Vad är 50% av 80?', options: ['20', '30', '40', '50'], correct: 2, category: 'procent' },
      { id: 25, question: 'En kvadrat har sidan 5 cm. Vad är omkretsen?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], correct: 2, category: 'geometri' },
    ],
  },
  'matematik-ak9': {
    questions: [
      { id: 1, question: 'Lös ekvationen: 2x + 5 = 13', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], correct: 2, category: 'ekvationer' },
      { id: 2, question: 'Vad är √16?', options: ['2', '3', '4', '5'], correct: 2, category: 'rötter' },
      { id: 3, question: 'En andragradsfunktion f(x) = x² har sitt minimum vid?', options: ['x = 0', 'x = 1', 'x = -1', 'inget minimum'], correct: 0, category: 'funktioner' },
      { id: 4, question: 'Vad är 3⁻²?', options: ['1/9', '1/3', '3', '9'], correct: 0, category: 'potenser' },
      { id: 5, question: 'Lös: x² = 25', options: ['x = 5', 'x = ±5', 'x = 25', 'ingen lösning'], correct: 1, category: 'ekvationer' },
      { id: 6, question: 'Medelvärdet av 2, 4, 6, 8 är?', options: ['4', '5', '6', '7'], correct: 1, category: 'statistik' },
      { id: 7, question: 'Vad är 2x · 3x?', options: ['5x', '6x', '6x²', '5x²'], correct: 2, category: 'algebra' },
      { id: 8, question: 'En linje har ekvationen y = 2x + 3. Vad är dess lutning?', options: ['1', '2', '3', '4'], correct: 1, category: 'funktioner' },
      { id: 9, question: 'Vad är (2 + 3)²?', options: ['10', '13', '25', '31'], correct: 2, category: 'algebra' },
      { id: 10, question: 'Lös: 3x - 2 = x + 6', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], correct: 2, category: 'ekvationer' },
      { id: 11, question: 'Vad är sannolikheten för att få en sexa när du kastar en tärning?', options: ['1/2', '1/3', '1/6', '1/5'], correct: 2, category: 'sannolikhet' },
      { id: 12, question: 'Lös: 2(x + 3) = 10', options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'], correct: 1, category: 'ekvationer' },
      { id: 13, question: 'Vad är √64?', options: ['6', '7', '8', '9'], correct: 2, category: 'rötter' },
      { id: 14, question: 'En rätvinklig triangel har katerna 3 och 4. Hypotenusans längd är?', options: ['5', '6', '7', '8'], correct: 0, category: 'geometri' },
      { id: 15, question: 'Förenkla: 2x² + 3x² - x²', options: ['3x²', '4x²', '5x²', '6x²'], correct: 1, category: 'algebra' },
      { id: 16, question: 'Vad är (ab)²?', options: ['ab', 'a²b', 'ab²', 'a²b²'], correct: 3, category: 'algebra' },
      { id: 17, question: 'Lös: x/2 = 5', options: ['x = 5', 'x = 10', 'x = 15', 'x = 20'], correct: 1, category: 'ekvationer' },
      { id: 18, question: 'Medianen av 1, 2, 3, 4, 5 är?', options: ['2', '3', '4', '5'], correct: 1, category: 'statistik' },
      { id: 19, question: 'Vad är 10%?', options: ['0.01', '0.1', '1', '10'], correct: 1, category: 'procent' },
      { id: 20, question: 'En fyrsidig figur är ett?', options: ['triangel', 'kvadrat', 'kvadrilateral', 'pentagon'], correct: 2, category: 'geometri' },
      { id: 21, question: 'Vad är x om 5x = 20?', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], correct: 2, category: 'ekvationer' },
      { id: 22, question: 'Förenkla: (x + 2)(x - 2)', options: ['x² - 4', 'x² + 4', 'x² - 2', 'x² + 2'], correct: 0, category: 'algebra' },
      { id: 23, question: 'Vad är 2³?', options: ['6', '8', '9', '12'], correct: 1, category: 'potenser' },
      { id: 24, question: 'Omkretsen av en cirkel med radie 3 är?', options: ['3π', '6π', '9π', '12π'], correct: 1, category: 'geometri' },
      { id: 25, question: 'Lös: x² - 4 = 0', options: ['x = 2', 'x = -2', 'x = ±2', 'ingen lösning'], correct: 2, category: 'ekvationer' },
    ],
  },
  'engelska-ak6': {
    questions: [
      { id: 1, question: 'Vad betyder "happy"?', options: ['ledsen', 'glad', 'trött', 'hungrig'], correct: 1, category: 'vocabulary' },
      { id: 2, question: 'Vilket är rätt: "She go" eller "She goes"?', options: ['She go', 'She goes', 'båda är rätta', 'ingen är rätt'], correct: 1, category: 'grammar' },
      { id: 3, question: 'Vad är pluralen av "child"?', options: ['childs', 'childes', 'children', 'childeren'], correct: 2, category: 'grammar' },
      { id: 4, question: 'Översätt: "Jag heter Anna"', options: ['I calls Anna', 'My name is Anna', 'I am Anna name', 'Anna is my'], correct: 1, category: 'grammar' },
      { id: 5, question: 'Vad betyder "book"?', options: ['bok', 'penna', 'bord', 'stol'], correct: 0, category: 'vocabulary' },
      { id: 6, question: 'Vilket ord passar: "I ___ a student"?', options: ['is', 'am', 'are', 'be'], correct: 1, category: 'grammar' },
      { id: 7, question: 'Vad betyder "blue"?', options: ['röd', 'blå', 'grön', 'gul'], correct: 1, category: 'vocabulary' },
      { id: 8, question: 'Pluralen av "apple" är?', options: ['apples', 'appls', 'apple', 'apples\'s'], correct: 0, category: 'grammar' },
      { id: 9, question: 'Vad betyder "run"?', options: ['gå', 'springa', 'hoppa', 'sitta'], correct: 1, category: 'vocabulary' },
      { id: 10, question: 'Vilken är rätt: "Do you like apples?" eller "Do you likes apples?"?', options: ['Do you like apples?', 'Do you likes apples?', 'båda är rätta', 'ingen är rätt'], correct: 0, category: 'grammar' },
      { id: 11, question: 'Vad betyder "big"?', options: ['liten', 'stor', 'medel', 'fin'], correct: 1, category: 'vocabulary' },
      { id: 12, question: 'Vad är motsatsen till "hot"?', options: ['warm', 'cold', 'cool', 'warm'], correct: 1, category: 'vocabulary' },
      { id: 13, question: 'Vilken är rätt tidsform: "I go" eller "I goes"?', options: ['I go', 'I goes', 'båda', 'ingen'], correct: 0, category: 'grammar' },
      { id: 14, question: 'Vad betyder "cat"?', options: ['hund', 'katt', 'fågel', 'fisk'], correct: 1, category: 'vocabulary' },
      { id: 15, question: 'Vad är frågans motsvarighet: "He plays football."', options: ['Does he plays football?', 'Does he play football?', 'Do he play football?', 'Is he play football?'], correct: 1, category: 'grammar' },
      { id: 16, question: 'Vad betyder "happy"?', options: ['trött', 'glad', 'ledsen', 'arg'], correct: 1, category: 'vocabulary' },
      { id: 17, question: 'Vad är pluralen av "boy"?', options: ['boys', 'boyes', 'boies', 'boy'], correct: 0, category: 'grammar' },
      { id: 18, question: 'Vad betyder "new"?', options: ['gammal', 'ny', 'ung', 'stor'], correct: 1, category: 'vocabulary' },
      { id: 19, question: 'Vilken är rätt: "She has got" eller "She has gotten"?', options: ['She has got', 'She has gotten', 'båda är rätta', 'ingen är rätt'], correct: 0, category: 'grammar' },
      { id: 20, question: 'Vad betyder "water"?', options: ['luft', 'vatten', 'jord', 'eld'], correct: 1, category: 'vocabulary' },
    ],
  },
  'svenska-ak6': {
    questions: [
      { id: 1, question: 'Vilket ord är stavat rätt?', options: ['restaurang', 'restaurent', 'restaruant', 'restaurent'], correct: 0, category: 'stavning' },
      { id: 2, question: 'Vad är ett substantiv?', options: ['ett ord som beskriver', 'ett ord som är en sak eller person', 'ett ord som anger handling', 'ett ord som förklarar'], correct: 1, category: 'grammatik' },
      { id: 3, question: 'Rätta stavfelet: "gränslos"', options: ['gränslös', 'grenslos', 'gränsslos', 'grenslos'], correct: 0, category: 'stavning' },
      { id: 4, question: 'Vilket är rätt pluralform av "hus"?', options: ['huses', 'hus', 'hussar', 'husen'], correct: 1, category: 'grammatik' },
      { id: 5, question: 'Vad är ett adjektiv?', options: ['ett ord som beskriver', 'ett ord som är en sak', 'ett ord som anger handling', 'ett ord som förklarar'], correct: 0, category: 'grammatik' },
      { id: 6, question: 'Stavningen av "möjlighet" är?', options: ['möjlighet', 'möjlihet', 'mojlighet', 'möjligjt'], correct: 0, category: 'stavning' },
      { id: 7, question: 'Vad betyder ordet "vag"?', options: ['molnig', 'otydlig', 'varm', 'tuff'], correct: 1, category: 'ordförståelse' },
      { id: 8, question: 'Rätta stavfelet: "utveckling"', options: ['utveckling', 'utvecklling', 'utvecling', 'utveckling'], correct: 0, category: 'stavning' },
      { id: 9, question: 'Vilket är rätt form: "Hon går" eller "Hon går"?', options: ['Hon går', 'Hon går', 'båda är rätta', 'ingen är rätt'], correct: 0, category: 'grammatik' },
      { id: 10, question: 'Vad kallas ordet "springa" grammatikaliskt?', options: ['substantiv', 'adjektiv', 'verb', 'adverb'], correct: 2, category: 'grammatik' },
      { id: 11, question: 'Stavningen av "karriär" är?', options: ['karriär', 'karjär', 'cariere', 'karriere'], correct: 0, category: 'stavning' },
      { id: 12, question: 'Vad betyder ordet "enväldig"?', options: ['väldigt ensam', 'mäktig', 'tråkig', 'ledsen'], correct: 1, category: 'ordförståelse' },
      { id: 13, question: 'Rätta stavfelet: "privat"', options: ['privat', 'privat', 'privat', 'privat'], correct: 0, category: 'stavning' },
      { id: 14, question: 'Vilket är rätt: "Det är mig" eller "Det är jag"?', options: ['Det är mig', 'Det är jag', 'båda är rätta', 'ingen är rätt'], correct: 1, category: 'grammatik' },
      { id: 15, question: 'Vad betyder ordet "flörtis"?', options: ['en liten flöte', 'att flirta lätt', 'en liten blomma', 'något nytt'], correct: 1, category: 'ordförståelse' },
    ],
  },
}

// Shuffle array helper
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Shuffle options for a single question
function shuffleQuestion(question: any) {
  const correctAnswer = question.options[question.correct]
  const shuffledOptions = shuffle(question.options)
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer)
  
  return {
    ...question,
    options: shuffledOptions,
    correct: newCorrectIndex,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json()

    // Map courseId to question bank key
    let bankKey = ''
    switch (courseId) {
      case '1':
      case 1:
        bankKey = 'matematik-ak6'
        break
      case '2':
      case 2:
        bankKey = 'engelska-ak6'
        break
      case '3':
      case 3:
        bankKey = 'svenska-ak6'
        break
      case '5':
      case 5:
        bankKey = 'matematik-ak9'
        break
      default:
        bankKey = 'matematik-ak6'
    }

    const bank = QUESTION_BANKS[bankKey]
    if (!bank) {
      return NextResponse.json(
        { error: 'Kursen finns inte än' },
        { status: 404 }
      )
    }

    // Get random 10 questions and shuffle each one
    const shuffledBank = shuffle(bank.questions)
    const selectedQuestions = shuffledBank.slice(0, 10).map(q => shuffleQuestion(q))

    return NextResponse.json({
      quizId: `quiz_${Date.now()}`,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length,
    })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Något gick fel när quizet skulle genereras' },
      { status: 500 }
    )
  }
}
