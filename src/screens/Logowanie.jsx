import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

function translateAuthError(message) {
  if (!message) return 'Coś poszło nie tak. Spróbuj jeszcze raz.'
  if (message.includes('Invalid login credentials')) return 'Nieprawidłowy e-mail lub hasło.'
  if (message.includes('User already registered')) return 'Ten e-mail jest już zajęty.'
  if (message.includes('already registered')) return 'Ten e-mail jest już zajęty.'
  if (message.includes('Password should be at least 6')) return 'Hasło musi mieć co najmniej 6 znaków.'
  if (message.includes('Invalid email')) return 'Nieprawidłowy adres e-mail.'
  if (message.includes('Email not confirmed')) return 'Potwierdź swój adres e-mail przed zalogowaniem.'
  return 'Coś poszło nie tak. Spróbuj jeszcze raz.'
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
)

export default function Logowanie() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (err) {
          setError(translateAuthError(err.message))
        } else {
          setSuccess('Sprawdź skrzynkę — wysłaliśmy link potwierdzający.')
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) setError(translateAuthError(err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!supabase) return
    setError('')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-dvh bg-[#0e0c11] flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <p className="text-[#554a63] text-xs tracking-widest uppercase text-center mb-6">
          Przystań
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-light text-[#f0ecf5] text-center mb-8">
          {mode === 'login' ? 'Witaj z powrotem.' : 'Utwórz konto.'}
        </h1>

        {/* Tab toggle */}
        <div className="flex bg-[#1c1824] rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-colors ${
              mode === 'login' ? 'bg-[#2f2a3a] text-zinc-100' : 'text-[#6b5f7a]'
            }`}
          >
            Zaloguj się
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm transition-colors ${
              mode === 'register' ? 'bg-[#2f2a3a] text-zinc-100' : 'text-[#6b5f7a]'
            }`}
          >
            Zarejestruj się
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {mode === 'register' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Twoje imię"
                  autoComplete="given-name"
                  required={mode === 'register'}
                  className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adres e-mail"
            autoComplete="email"
            required
            className="bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            className="bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
          />

          {/* Error / success */}
          {error && (
            <p className="text-rose-400/80 text-sm px-1">{error}</p>
          )}
          {success && (
            <p className="text-emerald-400/80 text-sm px-1">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-violet-900/40 border border-violet-700/50 text-[#f0ecf5] rounded-2xl py-4 text-sm transition-opacity mt-1 ${
              loading ? 'opacity-40 pointer-events-none' : 'active:scale-[0.98]'
            }`}
          >
            {loading ? '...' : mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#261f30]" />
          <span className="text-[#3d3449] text-xs">lub</span>
          <div className="flex-1 h-px bg-[#261f30]" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-[#1c1824] border border-[#2f2a3a] rounded-2xl py-4 text-sm text-[#d4cde0] active:scale-[0.98] transition-transform"
        >
          <GoogleIcon />
          Kontynuuj z Google
        </button>

        {/* Footer */}
        <p className="text-[#3d3449] text-xs text-center mt-10">
          Twoje dane są bezpieczne.
        </p>
      </motion.div>
    </div>
  )
}
