import { ArrowLeft, EyeOff } from 'lucide-react'

export default function ZdejmijZbroje({ navigate }) {
  return (
    <div className="px-6 py-8 max-w-lg mx-auto min-h-dvh flex flex-col">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-16">
        <EyeOff className="w-16 h-16 text-zinc-600 mb-10" strokeWidth={1} />
        <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-300 max-w-md">
          Jeśli Piotrek ma z czymś problem, powie Ci to sam. Nie musisz czytać
          w jego myślach. Zdejmij zbroję.
        </p>
      </div>
    </div>
  )
}
