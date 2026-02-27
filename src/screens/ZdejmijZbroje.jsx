import { motion } from 'framer-motion'
import { ArrowLeft, EyeOff } from 'lucide-react'

// ─── Pula tekstów o hiperczujności ───
// Rotacja dzienna — inny tekst każdego dnia
const allTexts = [
  'Jeśli Piotrek ma z czymś problem, powie Ci to sam. Nie musisz czytać w jego myślach. Możesz odpuścić.',
  'Nie każda cisza oznacza, że coś jest nie tak. Czasem cisza to po prostu cisza. Jesteś bezpieczna.',
  'Nie musisz skanować pokoju. Nie musisz analizować tonu głosu. Nikt tutaj nie jest zagrożeniem. Możesz się rozluźnić.',
  'To, że potrafisz czytać ludzi — to Twoja siła. Ale teraz nie musisz jej używać. Nikt tu nie planuje wybuchu.',
  'Piotrek nie jest Twoją mamą. Piotrek nie jest Twoim ojcem. Piotrek jest Piotrkiem. I on jest po Twojej stronie.',
]

function getDailyText() {
  const today = new Date()
  const dayIndex = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()
  return allTexts[dayIndex % allTexts.length]
}

export default function ZdejmijZbroje({ navigate }) {
  const text = getDailyText()

  return (
    <div className="px-6 py-8 max-w-lg mx-auto min-h-dvh flex flex-col">
      <button
        onClick={() => navigate('home')}
        className="relative z-10 flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors py-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <EyeOff className="w-16 h-16 text-zinc-600" strokeWidth={1} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-300 max-w-md mt-10"
        >
          {text}
        </motion.p>
      </div>
    </div>
  )
}
