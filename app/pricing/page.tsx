'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const FEATURES_COMPARISON = [
  { feature: 'Alla kurser', free: true, premium: true },
  { feature: 'Obegränsade quiz', free: false, premium: true },
  { feature: 'Se framsteg', free: true, premium: true },
  { feature: 'Nya frågor varje vecka', free: false, premium: true },
  { feature: 'Egna quizresultat sparade', free: false, premium: true },
  { feature: 'Statistik & grafer', free: false, premium: true },
  { feature: 'Personlig feedback', free: false, premium: true },
  { feature: '24/7 support', free: false, premium: true },
  { feature: 'Anpassade quiz baserat på svagheter', free: false, premium: true },
  { feature: 'Offline mode', free: false, premium: true },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const monthlyPrice = 99
  const yearlyPrice = 840
  const savings = Math.round((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12) * 100)

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-primary via-primary to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text-static">Enkel & transparent prissättning</h1>
          <p className="text-text-secondary text-xl max-w-2xl mx-auto">
            Börja gratis, uppgradera när du vill. Ingen dold avgift, avbryt när som helst.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-gradient-to-r from-neon to-accent text-primary'
                : 'glass hover:glass-hover text-text-secondary'
            }`}
          >
            Månad
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              billingPeriod === 'yearly'
                ? 'bg-gradient-to-r from-neon to-accent text-primary'
                : 'glass hover:glass-hover text-text-secondary'
            }`}
          >
            År
          </button>
          {billingPeriod === 'yearly' && (
            <motion.span
              className="px-3 py-1 bg-success/20 text-success text-sm font-bold rounded-full border border-success/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              Spara {savings}%
            </motion.span>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 lg:max-w-4xl lg:mx-auto">
          {/* Free Trial */}
          <motion.div
            className="glass-lg p-8 rounded-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -8 }}
          >
            <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-neon/30 to-accent/30 rounded-full text-sm font-bold text-neon border border-neon/50">
              Börja här
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-2 mt-4">Gratis provperiod</h3>
            <p className="text-text-tertiary mb-6">7 dagar helt gratis. Inget kort behövs.</p>

            <div className="mb-8">
              <div className="text-5xl font-black text-text-primary">0 kr</div>
              <p className="text-text-tertiary text-sm mt-2">under 7 dagar</p>
            </div>

            <div className="space-y-3 mb-8">
              {FEATURES_COMPARISON.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-text-secondary text-sm">
                  {item.free ? (
                    <Check size={18} className="text-success flex-shrink-0" />
                  ) : (
                    <X size={18} className="text-text-tertiary flex-shrink-0" />
                  )}
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="w-full px-4 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary text-center hover:shadow-glow-lg transition-all block"
            >
              Kom igång gratis
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            className="glass-lg p-8 rounded-2xl relative border-2 border-neon/50 lg:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
          >
            <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-neon to-accent rounded-full text-sm font-bold text-primary border border-neon">
              POPULÄRAST
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-2 mt-4">Premium</h3>
            <p className="text-text-tertiary mb-6">Efter din gratis provperiod</p>

            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <div className="text-5xl font-black text-neon">
                  {billingPeriod === 'monthly' ? '99' : '840'}
                </div>
                <span className="text-text-secondary">kr</span>
              </div>
              <p className="text-text-tertiary text-sm mt-2">
                {billingPeriod === 'monthly' ? '/månad' : '/år'}
              </p>
              {billingPeriod === 'yearly' && (
                <p className="text-success text-sm mt-2 font-semibold">
                  Det är {Math.round(yearlyPrice / 12)} kr/månad
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {FEATURES_COMPARISON.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-text-secondary text-sm">
                  {item.premium ? (
                    <Check size={18} className="text-neon flex-shrink-0" />
                  ) : (
                    <X size={18} className="text-text-tertiary flex-shrink-0" />
                  )}
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/signup"
              className="w-full px-4 py-3 bg-gradient-to-r from-neon to-accent rounded-lg font-bold text-primary text-center hover:shadow-glow-lg transition-all block mb-4"
            >
              Starta premiumet
            </Link>

            <p className="text-center text-xs text-text-tertiary">
              30-dagars pengarna-tillbaka-garanti. Ingen frågor ställda.
            </p>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Vanliga frågor om prissättning</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Varför kostar det 99 kr/mån?',
                a: 'Vi erbjuder en premium-upplevelse med tusentals unika frågor, statistik, och support. 99 kr/mån är väldigt billigt jämfört med traditionell privatlektioner!',
              },
              {
                q: 'Kan jag avbryta när som helst?',
                a: 'Ja! Ingen bindningstid. Du kan avbryta prenumerationen direkt från ditt konto när som helst.',
              },
              {
                q: 'Finns det rabatt för årsplan?',
                a: `Ja! Om du betalar för ett helt år får du ${savings}% rabatt. Det är bara ${Math.round(yearlyPrice / 12)} kr per månad.`,
              },
              {
                q: 'Vad händer efter den gratis perioden?',
                a: 'Efter 7 dagar debiteras du för första månad av premiumet. Du får en påminnelse innan det händer.',
              },
              {
                q: 'Kan jag få mina pengar tillbaka?',
                a: 'Ja! Vi erbjuder en 30-dagars pengarna-tillbaka-garanti om du inte är nöjd. Helt utan frågor.',
              },
              {
                q: 'Är det möjligt att få familjepris?',
                a: 'Kontakta oss på hello@npmonstret.se för att diskutera familjeprisering för flera användare.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="glass-lg p-6 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.05 }}
              >
                <h3 className="font-bold text-text-primary mb-2">{faq.q}</h3>
                <p className="text-text-tertiary text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="bg-gradient-to-r from-neon/10 to-accent/10 p-8 rounded-2xl border border-neon/30 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-bold text-text-primary mb-4">Säker och pålitlig</h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs text-text-tertiary">SSL-krypterad</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💳</div>
              <p className="text-xs text-text-tertiary">Säker betalning</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-xs text-text-tertiary">30 dagars garanti</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📞</div>
              <p className="text-xs text-text-tertiary">Support 24/7</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
