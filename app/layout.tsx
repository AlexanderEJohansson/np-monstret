import type { Metadata } from 'next'
import './globals.css'

async function Header() {
  return (
    <header className="bg-primary border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-neon">
          NP-Monstret
        </a>
        <nav className="hidden md:flex gap-6">
          <a href="/kurser" className="text-white hover:text-neon transition">
            Kurser
          </a>
          <a href="/dashboard" className="text-white hover:text-neon transition">
            Dashboard
          </a>
        </nav>
        <div className="flex gap-2">
          <a href="/auth/login">
            <button className="px-3 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-slate-700 transition">
              Logga in
            </button>
          </a>
          <a href="/auth/signup">
            <button className="px-3 py-2 text-sm bg-neon text-black rounded-lg hover:bg-cyan-400 transition">
              Registrera
            </button>
          </a>
        </div>
      </div>
    </header>
  )
}

export const metadata: Metadata = {
  title: 'NP-Monstret | Träna på Nationella Prov',
  description: 'Dynamiskt genererade nationella prov för svenska elever åk 6-gymnasiet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className="scroll-smooth">
      <body className="bg-primary text-white">
        <Header />
        {children}
      </body>
    </html>
  )
}
