import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Sun,
  BookOpen,
  Flame,
  EyeOff,
  ShieldAlert,
  Phone,
  Mic,
  MicOff,
  LogOut,
} from 'lucide-react'

// Kolejność: od najbardziej pozytywnych do kryzysowych
const buttons = [
  {
    id: 'sloik',
    label: 'Słoik Sukcesów',
    icon: Trophy,
    accent: 'text-amber-400/60',
  },
  {
    id: 'stan-zolty',
    label: 'Stan Żółty',
    icon: Sun,
    accent: 'text-yellow-400/60',
  },
  {
    id: 'stan-zielony',
    label: 'Stan Zielony',
    icon: BookOpen,
    accent: 'text-emerald-400/60',
  },
  {
    id: 'niszczarka',
    label: 'Niszczarka Myśli',
    icon: Flame,
    accent: 'text-orange-400/60',
  },
  {
    id: 'zdejmij-zbroje',
    label: 'Możesz Odpuścić',
    icon: EyeOff,
    accent: 'text-sky-400/60',
  },
  {
    id: 'stan-czerwony',
    label: 'Stan Czerwony',
    icon: ShieldAlert,
    accent: 'text-red-400/60',
  },
]

const bodyCheckOptions = [
  { label: 'Ściska mnie w klatce', target: 'stan-czerwony' },
  { label: 'Nie mogę się ruszyć', target: 'stan-zielony' },
  { label: 'Naelektryzowana', target: 'stan-czerwony' },
  { label: 'Jest okej', target: 'sloik' },
]

function getGreeting(name) {
  const firstName = name?.split(' ')[0] || 'Witaj'
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return `Dzień dobry, ${firstName}.`
  if (hour >= 12 && hour < 18) return `Cześć, ${firstName}.`
  if (hour >= 18 && hour < 22) return `Dobry wieczór, ${firstName}.`
  return `Hej, ${firstName}.`
}

export default function Home({ navigate, micEnabled, toggleMic, user, signOut }) {
  const [showCheckIn, setShowCheckIn] = useState(false)

  // ─── Long-press na nagłówek → Panel Piotrka ───
  const longPressTimer = useRef(null)

  const handlePressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      navigate('panel-piotrka')
    }, 3000)
  }, [navigate])

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return (
    <div className="px-4 py-8 max-w-lg mx-auto h-dvh flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <h1
          className="text-2xl font-light tracking-tight select-none"
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressEnd}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
        >
          {getGreeting(user?.user_metadata?.name)}
        </h1>

        <div className="flex items-center gap-1">
          {/* Mic toggle */}
          <button
            onClick={toggleMic}
            className="p-2 rounded-xl active:scale-[0.93] transition-transform"
            aria-label={micEnabled ? 'Wyłącz monitoring głośności' : 'Włącz monitoring głośności'}
          >
            {micEnabled ? (
              <Mic className="w-5 h-5 text-emerald-500/60" strokeWidth={1.5} />
            ) : (
              <MicOff className="w-5 h-5 text-zinc-700" strokeWidth={1.5} />
            )}
          </button>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="p-2 rounded-xl active:scale-[0.93] transition-transform"
            aria-label="Wyloguj się"
          >
            <LogOut className="w-5 h-5 text-zinc-700" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowCheckIn(!showCheckIn)}
        className="text-zinc-600 text-sm mb-4 block px-1 text-left"
      >
        {showCheckIn ? 'Schowaj' : 'Co mówi Ci teraz ciało?'}
      </button>

      <AnimatePresence>
        {showCheckIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              {bodyCheckOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => navigate(opt.target)}
                  className="bg-zinc-900 rounded-xl p-3 text-sm text-zinc-400 text-center active:scale-[0.97] transition-transform"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {buttons.map(({ id, label, icon: Icon, accent }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="bg-zinc-900 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center active:scale-[0.97] transition-transform duration-150"
          >
            <Icon className={`w-8 h-8 ${accent}`} strokeWidth={1.5} />
            <span className="text-sm text-zinc-300 leading-tight">{label}</span>
          </button>
        ))}
      </div>

      <div className="pt-4 text-center">
        <a
          href="tel:116123"
          className="inline-flex items-center gap-2 text-zinc-700 text-xs active:text-zinc-500 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Telefon Zaufania: 116 123</span>
        </a>
      </div>
    </div>
  )
}
