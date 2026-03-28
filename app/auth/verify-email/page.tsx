export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-neon">Verifiera Din E-post</h1>
        <p className="text-slate-400 mb-4">
          Vi har skickat en verifieringslänk till din e-postadress.
        </p>
        <p className="text-slate-500">
          Klicka på länken i mailet för att slutföra registreringen.
        </p>
      </div>
    </main>
  )
}
