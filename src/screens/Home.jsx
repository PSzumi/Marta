import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  Flame,
  Trophy,
  Sun,
  BookOpen,
  EyeOff,
  Phone,
} from 'lucide-react'

const buttons = [
  {
    id: 'stan-czerwony',
    label: 'Stan Czerwony',
    sublabel: 'Gdy wszystko jest za dużo',
    icon: ShieldAlert,
    accent: 'text-red-400/60',
  },
  {
    id: 'niszczarka',
    label: 'Niszczarka Myśli',
    sublabel: 'Wyrzuć i spal',
    icon: Flame,
    accent: 'text-orange-400/60',
  },
  {
    id: 'sloik',
    label: 'Słoik Sukcesów',
    sublabel: 'To, co już zrobiłaś',
    icon: Trophy,
    accent: 'text-amber-400/60',
  },
  {
    id: 'stan-zolty',
    label: 'Stan Żółty',
    sublabel: 'Szybka dawka dopaminy',
    icon: Sun,
    accent: 'text-yellow-400/60',
  },
  {
    id: 'stan-zielony',
    label: 'Stan Zielony',
    sublabel: 'Rozbrój wewnętrznego krytyka',
    icon: BookOpen,
    accent: 'text-emerald-400/60',
  },
  {
    id: 'zdejmij-zbroje',
    label: 'Zdejmij Zbroję',
    sublabel: 'Nie musisz czytać w myślach',
    icon: EyeOff,
    accent: 'text-sky-400/60',
  },
]

// ─── Body check-in ───
// Oparty na odczuciach cielesnych, nie emocjach
// (aleksytymia = trudność w nazywaniu emocji, ale ciało zawsze mówi prawdę)
const bodyCheckOptions = [
  {
    label: 'Ściska mnie w klatce',
    target: 'stan-czerwony',
  },
  {
    label: 'Nie mogę się ruszyć',
    target: 'stan-zielony',
  },
  {
    label: 'Jestem naelektryzowana',
    target: 'stan-czerwony',
  },
  {
    label: 'Jest okej',
    target: 'sloik',
  },
]

export default function Home({ navigate }) {
  const [showCheckIn, setShowCheckIn] = useState(false)

  return (
    <div className="px-6 py-12 max-w-lg mx-auto">
      <h1 className="text-3xl font-light mb-4 tracking-tight">
        Cześć, Marto.
      </h1>

      {/* Body check-in */}
      <button
        onClick={() => setShowCheckIn(!showCheckIn)}
        className="text-zinc-600 text-sm mb-8 block"
      >
        {showCheckIn
          ? 'Schowaj'
          : 'Jak się teraz czujesz w ciele?'}
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
            <div className="grid grid-cols-2 gap-3 mb-8">
              {bodyCheckOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => navigate(opt.target)}
                  className="bg-zinc-900 rounded-2xl p-4 text-sm text-zinc-400 text-center active:scale-[0.97] transition-transform"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Przyciski nawigacji */}
      <div className="space-y-4">
        {buttons.map(({ id, label, sublabel, icon: Icon, accent }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="w-full bg-zinc-900 rounded-2xl p-6 flex items-center gap-5 text-left active:scale-[0.98] transition-transform duration-150"
          >
            <Icon className={`w-8 h-8 shrink-0 ${accent}`} strokeWidth={1.5} />
            <div>
              <div className="text-xl text-zinc-200">{label}</div>
              <div className="text-sm text-zinc-500 mt-0.5">{sublabel}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Numer kryzysowy – dyskretny, ale zawsze dostępny */}
      <div className="mt-12 pt-6 border-t border-zinc-900 text-center">
        <a
          href="tel:116123"
          className="inline-flex items-center gap-2 text-zinc-700 text-sm active:text-zinc-500 transition-colors"
        >
          <Phone className="w-4 h-4" strokeWidth={1.5} />
          <span>Telefon Zaufania: 116 123</span>
        </a>
      </div>
    </div>
  )
}
