import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Flame } from 'lucide-react'

export default function NiszczarkaMysli({ navigate }) {
  const [text, setText] = useState('')
  const [burning, setBurning] = useState(false)
  const [burnText, setBurnText] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const textareaRef = useRef(null)

  // Auto-focus na wejściu — zero dodatkowych kliknięć (ADHD)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (textareaRef.current) textareaRef.current.focus()
    }, 500) // po animacji wejścia
    return () => clearTimeout(timer)
  }, [])

  const handleDestroy = () => {
    if (!text.trim() || burning) return

    // Haptic feedback — somatyczne potwierdzenie zniszczenia
    if (navigator.vibrate) navigator.vibrate(100)

    setBurnText(text)
    setBurning(true)
    setText('')

    setTimeout(() => {
      setBurning(false)
      setBurnText('')
      setShowValidation(true)
    }, 2200)

    setTimeout(() => {
      setShowValidation(false)
      if (textareaRef.current) textareaRef.current.focus()
    }, 6000)
  }

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-[#6b5f7a] mb-8 active:text-[#d4cde0] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-2">Niszczarka Myśli</h2>
      <p className="text-[#6b5f7a] mb-8">
        Cokolwiek tu wpiszesz, zostanie spalone. Nigdzie nie jest zapisywane.
      </p>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wyrzuć to z siebie..."
          rows={6}
          className="w-full bg-[#1c1824] text-[#f0ecf5] text-lg rounded-2xl p-6 resize-none border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
        />

        {burning && (
          <div
            className="absolute inset-0 bg-[#1c1824] rounded-2xl p-6 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div className="animate-fire text-lg whitespace-pre-wrap break-words">
              {burnText}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleDestroy}
        disabled={!text.trim() || burning}
        className="mt-6 w-full bg-[#1c1824] rounded-2xl p-5 flex items-center justify-center gap-3 text-xl disabled:opacity-30 active:scale-[0.98] transition-all duration-150"
      >
        <Flame
          className={`w-6 h-6 ${text.trim() && !burning ? 'text-orange-400/70' : 'text-[#554a63]'}`}
          strokeWidth={1.5}
        />
        <span className={text.trim() && !burning ? 'text-[#f0ecf5]' : 'text-[#554a63]'}>
          Zniszcz
        </span>
      </button>

      <AnimatePresence>
        {showValidation && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center text-[#6b5f7a] mt-8 text-lg font-light"
          >
            Pozbyłaś się tego. Nie musisz tego więcej nosić.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
