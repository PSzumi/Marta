import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX, Wind, Eye } from 'lucide-react'

// ─── Animowany przewodnik oddechowy ───
// Technika: fizjologiczne westchnienie (physiological sigh)
// Podwójny krótki wdech nosem → długi wydech ustami
// Najszybszy udowodniony sposób na aktywację przywspółczulnego UN
function BreathingGuide() {
  // Cykl: wdech 1 (1.5s) → wdech 2 (1s) → wydech (4s) → pauza (1s) = 7.5s
  const cycleDuration = 7.5

  return (
    <div className="flex flex-col items-center py-8">
      <motion.div
        className="rounded-full border-2 border-zinc-700 flex items-center justify-center"
        animate={{
          width: [80, 140, 160, 160, 80],
          height: [80, 140, 160, 160, 80],
          borderColor: [
            'rgba(113,113,122,0.5)',
            'rgba(161,161,170,0.6)',
            'rgba(161,161,170,0.7)',
            'rgba(161,161,170,0.5)',
            'rgba(113,113,122,0.3)',
          ],
          boxShadow: [
            '0 0 0px rgba(161,161,170,0)',
            '0 0 20px rgba(161,161,170,0.15)',
            '0 0 30px rgba(161,161,170,0.2)',
            '0 0 15px rgba(161,161,170,0.1)',
            '0 0 0px rgba(161,161,170,0)',
          ],
        }}
        transition={{
          duration: cycleDuration,
          times: [0, 0.2, 0.33, 0.87, 1],
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.span
          className="text-lg text-zinc-400 text-center select-none"
          animate={{
            opacity: [0, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration: cycleDuration,
            times: [0, 0.05, 0.2, 0.33, 0.87, 1],
            repeat: Infinity,
          }}
        >
          <motion.span
            animate={{
              opacity: [1, 1, 0, 0, 0],
            }}
            transition={{
              duration: cycleDuration,
              times: [0, 0.3, 0.34, 0.99, 1],
              repeat: Infinity,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            wdech
          </motion.span>
          <motion.span
            animate={{
              opacity: [0, 0, 1, 1, 0],
            }}
            transition={{
              duration: cycleDuration,
              times: [0, 0.33, 0.37, 0.85, 0.9],
              repeat: Infinity,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            wydech
          </motion.span>
        </motion.span>
      </motion.div>

      <p className="text-zinc-600 text-sm mt-6 text-center max-w-[240px]">
        Dwa krótkie wdechy nosem, jeden długi wydech ustami
      </p>
    </div>
  )
}

// ─── Uziemienie sensoryczne 5-4-3-2-1 ───
const groundingSteps = [
  { count: 5, sense: 'widzisz', icon: '👁', prompt: 'Rozejrzyj się. Wymień 5 rzeczy, które widzisz.' },
  { count: 4, sense: 'słyszysz', icon: '👂', prompt: 'Wsłuchaj się. Wymień 4 dźwięki, które słyszysz.' },
  { count: 3, sense: 'dotykasz', icon: '🤲', prompt: 'Dotknij czegoś. Wymień 3 rzeczy, które czujesz dotykiem.' },
  { count: 2, sense: 'czujesz zapachem', icon: '🌿', prompt: 'Wymień 2 zapachy wokół siebie.' },
  { count: 1, sense: 'czujesz smakiem', icon: '💧', prompt: 'Wymień 1 smak, który teraz czujesz.' },
]

function GroundingExercise() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const handleNext = () => {
    if (step < groundingSteps.length - 1) {
      setStep(step + 1)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-2xl font-light text-zinc-300 mb-3">Jesteś tutaj.</p>
        <p className="text-zinc-500">Teraz. W tym pokoju. Bezpieczna.</p>
        <button
          onClick={() => { setStep(0); setDone(false) }}
          className="mt-6 text-zinc-600 text-sm"
        >
          Zacznij od nowa
        </button>
      </motion.div>
    )
  }

  const current = groundingSteps[step]

  return (
    <div className="py-6">
      {/* Pasek postępu */}
      <div className="flex gap-2 mb-8 px-4">
        {groundingSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= step ? 'bg-zinc-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">{current.icon}</div>
          <p className="text-5xl font-light text-zinc-300 mb-4">{current.count}</p>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-sm mx-auto mb-8">
            {current.prompt}
          </p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="w-full bg-zinc-900 rounded-2xl p-5 text-lg text-zinc-300 active:scale-[0.98] transition-transform"
      >
        {step < groundingSteps.length - 1 ? 'Dalej' : 'Jestem tutaj'}
      </button>
    </div>
  )
}

// ─── Główny ekran Stan Czerwony ───
export default function StanCzerwony({ navigate }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [activeSection, setActiveSection] = useState(null) // 'breathing' | 'grounding' | null

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      {/* Brown noise / deszcz */}
      <audio ref={audioRef} src="/rain.mp3" loop preload="auto" />

      <button
        onClick={toggleAudio}
        className="w-full bg-zinc-900 rounded-2xl p-6 flex items-center justify-center gap-4 mb-6 active:scale-[0.98] transition-transform"
      >
        {playing ? (
          <VolumeX className="w-8 h-8 text-zinc-400" />
        ) : (
          <Volume2 className="w-8 h-8 text-zinc-400" />
        )}
        <span className="text-xl text-zinc-300">
          {playing ? 'Wycisz deszcz' : 'Włącz deszcz'}
        </span>
      </button>

      {/* Tekst uziemiający */}
      <div className="text-center mb-8 space-y-4">
        <p className="text-3xl font-light leading-relaxed">Oddychaj.</p>
        <p className="text-2xl font-light leading-relaxed text-zinc-400">
          To tylko echo przeszłości.
        </p>
        <p className="text-2xl font-light leading-relaxed text-zinc-300">
          Jesteś bezpieczna.
        </p>
      </div>

      {/* Narzędzia somatyczne */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSection(activeSection === 'breathing' ? null : 'breathing')}
          className={`flex-1 rounded-2xl p-5 flex flex-col items-center gap-2 transition-colors active:scale-[0.98] ${
            activeSection === 'breathing'
              ? 'bg-zinc-800 border border-zinc-700'
              : 'bg-zinc-900 border border-zinc-800/50'
          }`}
        >
          <Wind className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
          <span className="text-sm text-zinc-400">Oddech</span>
        </button>
        <button
          onClick={() => setActiveSection(activeSection === 'grounding' ? null : 'grounding')}
          className={`flex-1 rounded-2xl p-5 flex flex-col items-center gap-2 transition-colors active:scale-[0.98] ${
            activeSection === 'grounding'
              ? 'bg-zinc-800 border border-zinc-700'
              : 'bg-zinc-900 border border-zinc-800/50'
          }`}
        >
          <Eye className="w-7 h-7 text-zinc-400" strokeWidth={1.5} />
          <span className="text-sm text-zinc-400">Uziemienie</span>
        </button>
      </div>

      {/* Sekcja aktywnego narzędzia */}
      <AnimatePresence mode="wait">
        {activeSection === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
              <BreathingGuide />
            </div>
          </motion.div>
        )}
        {activeSection === 'grounding' && (
          <motion.div
            key="grounding"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6">
              <GroundingExercise />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotify */}
      <div className="mb-6">
        <iframe
          className="w-full rounded-2xl border border-zinc-800"
          style={{ height: '152px' }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp?utm_source=generator&theme=0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify – relaksacja"
        />
      </div>

      {/* YouTube */}
      <div>
        <iframe
          className="w-full aspect-video rounded-2xl border border-zinc-800"
          src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="YouTube – relaksacja"
        />
      </div>
    </div>
  )
}
