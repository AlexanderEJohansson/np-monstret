import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'NP-Monstret | Träna på nya nationella prov',
  description: 'Träna på nya och unika nationella prov online. Fokuserad quiz-träning för svenska elever i åk 6, 9 och gymnasiet.',
  keywords: 'nationella prov, quiz, träning, svenska, matematik, engelska',
  authors: [{ name: 'NP-Monstret' }],
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="bg-primary text-text-primary">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
