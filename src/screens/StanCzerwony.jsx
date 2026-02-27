import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Volume2, VolumeX, Wind, Eye } from 'lucide-react'

// ─── Animowany przewodnik oddechowy ───
// Fizjologiczne westchnienie (physiological sigh):
// Wdech 1 nosem (1.2s) → krótka pauza → Wdech 2 nosem (1s) → Wydech ustami (4s) → pauza (1.3s)
// Koło: puls 1 (mały→średni) → cofnięcie → puls 2 (średni→duży) → kurczenie na wydechu
function BreathingGuide() {
  // Fazy: 'inhale1' | 'inhale2' | 'exhale' | 'pause'
  const [phase, setPhase] = useState('inhale1')

  useEffect(() => {
    let mounted = true
    const timers = []

    const runCycle = () => {
      if (!mounted) return

      setPhase('inhale1')

      timers.push(setTimeout(() => {
        if (!mounted) return
        setPhase('inhale2')
      }, 1500)) // po wdechu 1 (1.2s + 0.3s pauza)

      timers.push(setTimeout(() => {
        if (!mounted) return
        setPhase('exhale')
      }, 2800)) // po wdechu 2 (1.3s później)

      timers.push(setTimeout(() => {
        if (!mounted) return
        setPhase('pause')
      }, 6800)) // po wydechu (4s)

      timers.push(setTimeout(() => {
        if (!mounted) return
        runCycle()
      }, 8000)) // po pauzie (1.2s) → nowy cykl
    }

    runCycle()
    return () => {
      mounted = false
      timers.forEach(clearTimeout)
    }
  }, [])

  const circleSize = {
    inhale1: 120,
    inhale2: 165,
    exhale: 70,
    pause: 70,
  }[phase]

  const isInhale = phase === 'inhale1' || phase === 'inhale2'
  const isPause = phase === 'pause'

  const circleDuration = {
    inhale1: 1.2,
    inhale2: 1.0,
    exhale: 4.0,
    pause: 0.5,
  }[phase]

  const label = isInhale ? 'wdech' : isPause ? '' : 'wydech'
  const sublabel = isInhale ? 'nosem' : isPause ? '' : 'ustami'
  const pulseNum = phase === 'inhale2' ? '2' : phase === 'inhale1' ? '1' : ''

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative" style={{ width: 180, height: 180 }}>
        {/* Pulsujące koło */}
        <motion.div
          className="absolute rounded-full border-2"
          style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
          animate={{
            width: circleSize,
            height: circleSize,
            borderColor: isInhale
              ? 'rgba(147, 197, 253, 0.5)'
              : isPause
                ? 'rgba(113, 113, 122, 0.3)'
                : 'rgba(253, 186, 116, 0.4)',
            boxShadow: isInhale
              ? '0 0 25px rgba(147, 197, 253, 0.15)'
              : isPause
                ? '0 0 0px rgba(0,0,0,0)'
                : '0 0 15px rgba(253, 186, 116, 0.1)',
          }}
          transition={{
            duration: circleDuration,
            ease: 'easeInOut',
          }}
        />

        {/* Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {label && (
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-1 select-none"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-light ${
                      isInhale ? 'text-blue-300/70' : 'text-orange-300/60'
                    }`}
                  >
                    {label}
                  </span>
                  {pulseNum && (
                    <span className="text-xs text-blue-400/40">{pulseNum}/2</span>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    isInhale ? 'text-blue-400/40' : 'text-orange-400/40'
                  }`}
                >
                  {sublabel}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-zinc-600 text-sm mt-6 text-center max-w-[260px]">
        Dwa krótkie wdechy nosem, jeden długi wydech ustami
      </p>
    </div>
  )
}

// ─── Uziemienie sensoryczne 5-4-3-2-1 ───
const groundingSteps = [
  { count: 5, icon: '👁', prompt: 'Rozejrzyj się. Wymień 5 rzeczy, które widzisz.' },
  { count: 4, icon: '👂', prompt: 'Wsłuchaj się. Wymień 4 dźwięki, które słyszysz.' },
  { count: 3, icon: '🤲', prompt: 'Dotknij czegoś. Wymień 3 rzeczy, które czujesz dotykiem.' },
  { count: 2, icon: '🌿', prompt: 'Wymień 2 zapachy wokół siebie.' },
  { count: 1, icon: '💧', prompt: 'Wymień 1 smak, który teraz czujesz.' },
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

// ─── Główny ekran ───
export default function StanCzerwony({ navigate }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

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

      <audio ref={audioRef} src="/storm.wav" loop preload="auto" />

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

      {/* Tekst uziemiający — sekwencyjne pojawianie się */}
      <div className="text-center mb-8 space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl font-light leading-relaxed"
        >
          Oddychaj.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-2xl font-light leading-relaxed text-zinc-400"
        >
          To tylko echo przeszłości.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="text-2xl font-light leading-relaxed text-zinc-300"
        >
          Jesteś bezpieczna.
        </motion.p>
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
