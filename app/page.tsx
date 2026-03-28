'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, BarChart3, Trophy, ChevronDown } from 'lucide-react'

const COURSES = [
  { name: 'Matematik Åk 6', subject: '📐', grade: 'Åk 6' },
  { name: 'Engelska Åk 6', subject: '🇬🇧', grade: 'Åk 6' },
  { name: 'Svenska Åk 6', subject: '📝', grade: 'Åk 6' },
  { name: 'Matematik Åk 9', subject: '📐', grade: 'Åk 9' },
  { name: 'Engelska Åk 9', subject: '🇬🇧', grade: 'Åk 9' },
  { name: 'Svenska Åk 9', subject: '📝', grade: 'Åk 9' },
  { name: 'Matematik Gym', subject: '📐', grade: 'Gym' },
  { name: 'Engelska Gym', subject: '🇬🇧', grade: 'Gym' },
  { name: 'Svenska Gym', subject: '📝', grade: 'Gym' },
  { name: 'Historia Åk 6', subject: '🏛️', grade: 'Åk 6' },
  { name: 'Naturkunskap Åk 9', subject: '🔬', grade: 'Åk 9' },
  { name: 'Samhällskunskap Gym', subject: '🌍', grade: 'Gym' },
]

const TESTIMONIALS = [
  {
    name: 'Sofia Andersson',
    grade: 'Åk 9',
    text: 'Fick MVG på nationella provet tack vare NP-Monstret! Frågorna är så realistiska.',
    avatar: 'SA',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Erik Svensson',
    grade: 'Åk 6',
    text: 'Bästa sättet att plugga för NP! Mycket roligare än gamla prov.',
    avatar: 'ES',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Maja Lindström',
    grade: 'Gymnasiet',
    text: 'Spenderar 30 min varje dag och ser redan resultat. Verkligen värt det!',
    avatar: 'ML',
    color: 'from-purple-500 to-violet-500',
  },
]

const FAQS = [
  {
    q: 'Är frågorna som riktiga nationella prov?',
    a: 'Ja! Alla våra frågor är skapade för att matcha nivån och stilen på riktiga NP. Vi uppdaterar dem regelbundet baserat på nya prov.',
  },
  {
    q: 'Kan jag använda det på mobilen?',
    a: 'Helt enkelt ja. NP-Monstret är helt mobiloptimerat och fungerar perfekt på både telefon och tablet.',
  },
  {
    q: 'Hur funkar 7 dagars gratis?',
    a: 'Registrera dig, få tillgång till alla kurser i 7 dagar utan att ange kort. Om du gillar det, betalar du bara 99 kr/mån efter det.',
  },
  {
    q: 'Vad händer om jag avbryter?',
    a: 'Inga problem! Avbryt när som helst utan bindningstid. Du förlorar tillgången när din månad är slut, men ingen straffavgift.',
  },
]

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon/20 rounded-full mix-blend-screen filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-neon/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon/20 to-accent/20 rounded-full border border-neon/30 animate-pulse"
          >
            <span className="text-xl">🔥</span>
            <span className="text-neon font-semibold">Över 1000 elever pluggar redan</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black leading-tight space-y-2">
            <span className="gradient-text block">Sluta plugga gamla prov</span>
            <span className="text-text-primary block">Träna på <span className="gradient-text">NYA</span> istället</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            NP-Monstret ger dig tusentals unika frågor som matchar riktiga nationella prov. Träna smart, slå prövet.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-neon to-accent rounded-xl font-bold text-primary hover:shadow-glow-lg transition-all transform hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span>Testa gratis i 7 dagar</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/kurser"
              className="px-8 py-4 glass hover:glass-hover rounded-xl font-bold text-neon w-full sm:w-auto justify-center flex items-center"
            >
              Se alla kurser
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={itemVariants} className="flex items-center justify-center space-x-2 text-text-tertiary pt-4">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-neon to-accent border-2 border-primary"></div>
              ))}
            </div>
            <span>1000+ nöjda elever</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary via-primary to-secondary/30">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">Varför välja NP-Monstret?</h2>
            <p className="text-text-secondary text-lg">Allt du behöver för att knäcka nationella provet</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Unika frågor',
                desc: 'Tusentals NEW frågor, inte gamla repeterade. Varje quiz är unikt.',
              },
              {
                icon: BarChart3,
                title: 'Se dina framsteg',
                desc: 'Realtidsstatistik visar vad du är bra på – och vad du behöver träna mer.',
              },
              {
                icon: Trophy,
                title: 'Kännas verkligt',
                desc: 'Frågorna matchar riktiga nationella prov. Du tränar på DET som kommer.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="glass-lg p-8 rounded-2xl hover:glass-hover transition-all transform hover:scale-105 group cursor-pointer"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <feature.icon className="w-12 h-12 text-neon mb-4 group-hover:glow-pulse" />
                <h3 className="text-xl font-bold mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-text-tertiary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== COURSES PREVIEW ===== */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">12 kurser för alla nivåer</h2>
            <p className="text-text-secondary text-lg">Från åk 6 till gymnasiet</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, idx) => (
              <motion.div
                key={idx}
                className="glass-lg p-6 rounded-xl hover:glass-hover transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 3) * 0.1 }}
                viewport={{ once: true }}
                onClick={() => router.push('/kurser')}
              >
                <div className="text-3xl mb-3">{course.subject}</div>
                <h3 className="font-bold text-text-primary mb-2">{course.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded bg-neon/20 text-neon">{course.grade}</span>
                  <ArrowRight size={16} className="text-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link
              href="/kurser"
              className="inline-block px-8 py-4 bg-gradient-to-r from-neon to-accent rounded-xl font-bold text-primary hover:shadow-glow-lg transition-all transform hover:scale-105"
            >
              Utforska alla kurser
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary via-secondary/20 to-primary">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">Hur det funkar</h2>
            <p className="text-text-secondary text-lg">3 enkla steg till bättre betyg</p>
          </div>

          <div className="space-y-8">
            {[
              { num: '1', title: 'Välj en kurs', desc: 'Bläddra bland alla kurser och välj det du vill träna på.' },
              { num: '2', title: 'Gör ett quiz', desc: 'Svara på unika frågor som matchar riktiga prov. Du får resultat direkt.' },
              { num: '3', title: 'Bli bättre', desc: 'Se dina svagheter, träna mer på det – och slå provet! 🚀' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon to-accent flex items-center justify-center font-bold text-primary text-lg">
                    {step.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-lg">{step.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="absolute left-6 w-1 h-20 bg-gradient-to-b from-neon to-transparent -ml-7 mt-12 hidden md:block"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">Det säger andra elever</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                className="glass-lg p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center font-bold text-white`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-tertiary">{testimonial.grade}</p>
                  </div>
                </div>
                <p className="text-text-secondary italic">&quot;{testimonial.text}&quot;</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary via-primary to-secondary/30">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">Enkel prissättning</h2>
            <p className="text-text-secondary text-lg">Ingen dold avgift, avbryt när du vill</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-neon to-accent text-primary'
                  : 'glass hover:glass-hover text-text-secondary'
              }`}
            >
              Månad
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-neon to-accent text-primary'
                  : 'glass hover:glass-hover text-text-secondary'
              }`}
            >
              År <span className="text-xs text-success ml-1">-30%</span>
            </button>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Free Trial */}
            <motion.div
              className="glass-lg p-8 rounded-2xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-neon/30 to-accent/30 rounded-full text-sm font-bold text-neon border border-neon/50">
                Börja här
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 mt-4">Gratis provperiod</h3>
              <p className="text-text-tertiary mb-6">7 dagar helt gratis. Inget kort behövs.</p>
              <div className="space-y-3 mb-6">
                {['Alla 12 kurser', 'Obegränsade quiz', 'Se dina framsteg'].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2 text-text-secondary">
                    <div className="w-4 h-4 rounded-full bg-success/30 border border-success"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/signup"
                className="w-full px-4 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary text-center hover:shadow-glow-lg transition-all"
              >
                Kom igång
              </Link>
            </motion.div>

            {/* Premium */}
            <motion.div
              className="glass-lg p-8 rounded-2xl relative border-2 border-neon/50 transform scale-105 md:scale-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-neon to-accent rounded-full text-sm font-bold text-primary">
                POPULÄRAST
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 mt-4">Premium</h3>
              <p className="text-4xl font-bold text-neon mb-6">
                {billingPeriod === 'monthly' ? '99 kr' : '840 kr'} <span className="text-lg text-text-secondary">{billingPeriod === 'monthly' ? '/mån' : '/år'}</span>
              </p>
              <div className="text-success text-sm mb-6 block">
                {billingPeriod === 'yearly' && 'Spara 30% jämfört med månad'}
              </div>
              <div className="space-y-3 mb-6">
                {[
                  'Allt i gratis + :',
                  'Efter 7 dagars provperiod',
                  'Ingen bindningstid',
                  'Avbryt när som helst',
                  '24/7 support',
                  'Nya frågor varje vecka',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2 text-text-secondary">
                    <div className="w-4 h-4 rounded-full bg-neon/30 border border-neon"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/signup"
                className="w-full px-4 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary text-center hover:shadow-glow-lg transition-all"
              >
                Starta premiumet
              </Link>
              <p className="text-center text-xs text-text-tertiary mt-4">30-dagars pengarna-tillbaka-garanti. Ingen frågor ställda.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-static">Vanliga frågor</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                className="glass-lg rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
                >
                  <span className="font-bold text-text-primary">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-neon transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === idx && (
                  <motion.div
                    className="px-6 py-4 border-t border-neon/10 bg-secondary/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-text-secondary">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center glass-lg rounded-3xl p-12 border-2 border-neon/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text-static">Dags att bli en NP-Monster?</h2>
          <p className="text-text-secondary text-lg mb-8">Testa gratis i 7 dagar. Inget kort behövs.</p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-neon to-accent rounded-xl font-bold text-primary hover:shadow-glow-lg transition-all transform hover:scale-105"
          >
            Kom igång nu 🚀
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
