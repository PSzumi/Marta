import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, MessageSquareHeart, Sparkles, ChevronRight, Plus, X } from 'lucide-react'
import { saveSettings, extractSpotifyId, DEFAULTS } from '../lib/userSettings'

const STEPS = [
  {
    id: 'spotify',
    icon: Music,
    title: 'Twoja muzyka',
    subtitle: 'Wklej link do playlisty Spotify, która Cię uspokaja. Pojawi się w Stanie Czerwonym i Żółtym.',
  },
  {
    id: 'calming',
    icon: MessageSquareHeart,
    title: 'Zdania, które Ci pomagają',
    subtitle: 'Co chcesz zobaczyć gdy jest bardzo ciężko? Możesz zostawić domyślne lub wpisać swoje.',
  },
  {
    id: 'affirmations',
    icon: Sparkles,
    title: 'Przypomnienia dla siebie',
    subtitle: 'Zdania rotujące codziennie w ekranie „Możesz Odpuścić". Możesz dodać tyle ile chcesz.',
  },
]

export default function Onboarding({ userId, userName, onComplete }) {
  const [step, setStep] = useState(0)

  // Spotify
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [spotifyError, setSpotifyError] = useState('')

  // Calming sentences (3)
  const [calmingSentences, setCalmingSentences] = useState([...DEFAULTS.calmingSentences])

  // Affirmations (dynamic list)
  const [affirmations, setAffirmations] = useState([...DEFAULTS.affirmations])
  const [newAffirmation, setNewAffirmation] = useState('')

  const firstName = userName?.split(' ')[0] || 'Witaj'

  const validateSpotify = () => {
    if (!spotifyUrl.trim()) return true // można pominąć
    const id = extractSpotifyId(spotifyUrl)
    if (!id) {
      setSpotifyError('Wklej pełny link do playlisty, np. https://open.spotify.com/playlist/...')
      return false
    }
    setSpotifyError('')
    return true
  }

  const handleNext = () => {
    if (step === 0 && !validateSpotify()) return
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  const finish = () => {
    const spotifyId = extractSpotifyId(spotifyUrl) || ''
    saveSettings(userId, {
      onboardingComplete: true,
      spotifyPlaylistId: spotifyId,
      calmingSentences: calmingSentences.filter(s => s.trim()),
      affirmations: affirmations.filter(s => s.trim()),
    })
    onComplete()
  }

  const addAffirmation = () => {
    if (!newAffirmation.trim()) return
    setAffirmations([...affirmations, newAffirmation.trim()])
    setNewAffirmation('')
  }

  const removeAffirmation = (i) => {
    setAffirmations(affirmations.filter((_, idx) => idx !== i))
  }

  const currentStep = STEPS[step]
  const StepIcon = currentStep.icon

  return (
    <div className="min-h-dvh bg-black flex flex-col px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-auto flex flex-col flex-1"
      >
        {/* Header */}
        {step === 0 && (
          <div className="mb-10">
            <p className="text-zinc-600 text-xs tracking-widest uppercase mb-4">Przystań</p>
            <h1 className="text-3xl font-light text-zinc-200 mb-2">
              Cześć, {firstName}.
            </h1>
            <p className="text-zinc-500 font-light">
              Skonfigurujmy aplikację pod Ciebie. Zajmie to chwilę.
            </p>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? 'bg-zinc-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <StepIcon className="w-6 h-6 text-zinc-500" strokeWidth={1.5} />
              <div>
                <h2 className="text-xl font-light text-zinc-200">{currentStep.title}</h2>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              {currentStep.subtitle}
            </p>

            {/* ─── Step 0: Spotify ─── */}
            {step === 0 && (
              <div className="space-y-3">
                <input
                  type="url"
                  value={spotifyUrl}
                  onChange={(e) => { setSpotifyUrl(e.target.value); setSpotifyError('') }}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="w-full bg-zinc-900 text-zinc-200 rounded-2xl px-5 py-4 border border-zinc-800 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-700 transition-colors text-sm"
                />
                {spotifyError && (
                  <p className="text-rose-400/80 text-sm px-1">{spotifyError}</p>
                )}
                <p className="text-zinc-700 text-xs px-1">
                  Możesz pominąć — zmienisz to później w ustawieniach.
                </p>
              </div>
            )}

            {/* ─── Step 1: Calming sentences ─── */}
            {step === 1 && (
              <div className="space-y-3">
                {calmingSentences.map((s, i) => (
                  <input
                    key={i}
                    type="text"
                    value={s}
                    onChange={(e) => {
                      const updated = [...calmingSentences]
                      updated[i] = e.target.value
                      setCalmingSentences(updated)
                    }}
                    placeholder={`Zdanie ${i + 1}...`}
                    className="w-full bg-zinc-900 text-zinc-200 rounded-2xl px-5 py-4 border border-zinc-800 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-600 transition-colors"
                  />
                ))}
                <p className="text-zinc-700 text-xs px-1">
                  Te zdania pojawią się po kolei gdy otworzysz Stan Czerwony.
                </p>
              </div>
            )}

            {/* ─── Step 2: Affirmations ─── */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {affirmations.map((aff, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <p className="flex-1 bg-zinc-900 rounded-2xl px-5 py-3 text-zinc-300 text-sm leading-relaxed border border-zinc-800">
                        {aff}
                      </p>
                      <button
                        onClick={() => removeAffirmation(i)}
                        className="p-2 text-zinc-700 active:text-zinc-400 transition-colors mt-1 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAffirmation}
                    onChange={(e) => setNewAffirmation(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAffirmation() } }}
                    placeholder="Dodaj swoje zdanie..."
                    className="flex-1 bg-zinc-900 text-zinc-200 rounded-2xl px-5 py-4 border border-zinc-800 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-600 transition-colors text-sm"
                  />
                  <button
                    onClick={addAffirmation}
                    disabled={!newAffirmation.trim()}
                    className="bg-zinc-900 rounded-2xl px-4 border border-zinc-800 disabled:opacity-30 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-zinc-600 text-sm active:text-zinc-400 transition-colors"
            >
              Wróć
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-zinc-800 rounded-2xl px-6 py-3 text-zinc-200 text-sm active:scale-[0.98] transition-transform"
          >
            {step < STEPS.length - 1 ? (
              <>
                Dalej
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              'Gotowe'
            )}
          </button>
        </div>

        {/* Skip all */}
        {step === 0 && (
          <button
            onClick={finish}
            className="text-zinc-700 text-xs text-center mt-4 active:text-zinc-500 transition-colors"
          >
            Pomiń konfigurację
          </button>
        )}
      </motion.div>
    </div>
  )
}
