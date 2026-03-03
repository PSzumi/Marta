import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Wind } from 'lucide-react'
import Home from './screens/Home'
import StanCzerwony from './screens/StanCzerwony'
import NiszczarkaMysli from './screens/NiszczarkaMysli'
import SloikSukcesow from './screens/SloikSukcesow'
import StanZolty from './screens/StanZolty'
import StanZielony from './screens/StanZielony'
import ZdejmijZbroje from './screens/ZdejmijZbroje'
import PanelPiotrka from './screens/PanelPiotrka'
import { useRealtimeChannel } from './lib/realtime'
import { useLoudnessDetector } from './lib/loudness'

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: 'easeInOut' },
}

function App() {
  const [screen, setScreen] = useState('home')

  // ─── Ping popup (wiadomość od Piotrka) ───
  const [pingPopup, setPingPopup] = useState(null)

  // ─── Loudness popup ───
  const [loudPopup, setLoudPopup] = useState(false)

  // ─── Audio ref for remote play ───
  const audioRef = useRef(null)

  // ─── Mic monitoring state (persisted in localStorage) ───
  const [micEnabled, setMicEnabled] = useState(() => {
    return localStorage.getItem('przystan-mic') === 'on'
  })

  const navigate = useCallback((target) => {
    setScreen(target)
    window.scrollTo(0, 0)
  }, [])

  // ─── Supabase Realtime: odbieranie pingów od Piotrka ───
  useRealtimeChannel('przystan-ping', (payload) => {
    if (!payload) return

    switch (payload.action) {
      case 'navigate':
        navigate(payload.screen)
        break
      case 'play-music':
        if (audioRef.current) {
          audioRef.current.play().catch(() => {})
        }
        break
      case 'message':
        setPingPopup(payload.text)
        break
    }
  })

  // ─── Loudness detection ───
  const { isListening, start: startMic, stop: stopMic } = useLoudnessDetector({
    threshold: 0.15,
    sustainMs: 2000,
    cooldownMs: 60000,
    onLoud: () => setLoudPopup(true),
  })

  // Sync mic state with localStorage and actual microphone
  useEffect(() => {
    if (micEnabled && !isListening) {
      startMic()
    } else if (!micEnabled && isListening) {
      stopMic()
    }
  }, [micEnabled])

  const toggleMic = useCallback(() => {
    const next = !micEnabled
    setMicEnabled(next)
    localStorage.setItem('przystan-mic', next ? 'on' : 'off')
  }, [micEnabled])

  const renderScreen = () => {
    switch (screen) {
      case 'stan-czerwony':
        return <StanCzerwony navigate={navigate} />
      case 'niszczarka':
        return <NiszczarkaMysli navigate={navigate} />
      case 'sloik':
        return <SloikSukcesow navigate={navigate} />
      case 'stan-zolty':
        return <StanZolty navigate={navigate} />
      case 'stan-zielony':
        return <StanZielony navigate={navigate} />
      case 'zdejmij-zbroje':
        return <ZdejmijZbroje navigate={navigate} />
      case 'panel-piotrka':
        return <PanelPiotrka navigate={navigate} />
      default:
        return <Home navigate={navigate} micEnabled={micEnabled} toggleMic={toggleMic} />
    }
  }

  return (
    <div className="min-h-dvh bg-black text-zinc-200">
      {/* Hidden audio for remote play */}
      <audio ref={audioRef} src="/storm.wav" loop preload="auto" />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          {...pageTransition}
          className="min-h-dvh"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* ─── Popup: wiadomość od Piotrka ─── */}
      <AnimatePresence>
        {pingPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
            onClick={() => setPingPopup(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full text-center border border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-10 h-10 text-rose-400/60 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-xl text-zinc-200 font-light leading-relaxed mb-6">
                {pingPopup}
              </p>
              <button
                onClick={() => setPingPopup(null)}
                className="bg-zinc-800 rounded-2xl px-8 py-3 text-zinc-300 active:scale-[0.97] transition-transform"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Popup: za głośno ─── */}
      <AnimatePresence>
        {loudPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full text-center border border-zinc-800"
            >
              <p className="text-2xl text-zinc-200 font-light leading-relaxed mb-2">
                Hej...
              </p>
              <p className="text-lg text-zinc-400 font-light leading-relaxed mb-8">
                Trochę głośno. Chcesz się na chwilę zatrzymać?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setLoudPopup(false)
                    navigate('stan-czerwony')
                  }}
                  className="flex-1 bg-zinc-800 rounded-2xl py-3 flex items-center justify-center gap-2 text-zinc-300 active:scale-[0.97] transition-transform"
                >
                  <Wind className="w-5 h-5 text-blue-400/60" strokeWidth={1.5} />
                  <span>Oddech</span>
                </button>
                <button
                  onClick={() => setLoudPopup(false)}
                  className="flex-1 bg-zinc-800 rounded-2xl py-3 text-zinc-400 active:scale-[0.97] transition-transform"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
