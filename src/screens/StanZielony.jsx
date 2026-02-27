import { ArrowLeft, Brain, Shield, Heart } from 'lucide-react'

export default function StanZielony({ navigate }) {
  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-8">Stan Zielony</h2>

      <div className="space-y-6">
        {/* Fiszka 1 – ADHD / Paraliż wykonawczy */}
        <div className="bg-zinc-900 rounded-2xl p-8">
          <Brain className="w-10 h-10 text-emerald-400/50 mb-5" strokeWidth={1.5} />
          <p className="text-xl leading-relaxed text-zinc-300">
            Wiesz, co masz zrobić, ale ciało odmawia? To nie lenistwo. To
            paraliż funkcji wykonawczych (ADHD). Twój silnik nie ma teraz
            paliwa, żeby ruszyć. Odpuść.
          </p>
        </div>

        {/* Fiszka 2 – Reakcja walki/ucieczki */}
        <div className="bg-zinc-900 rounded-2xl p-8">
          <Shield className="w-10 h-10 text-emerald-400/50 mb-5" strokeWidth={1.5} />
          <p className="text-xl leading-relaxed text-zinc-300">
            Robisz rzeczy wbrew sobie i tracisz kontrolę w nerwach? To reakcja
            walki/ucieczki Twojego układu nerwowego. Twój mózg ratuje Cię przed
            wyimaginowanym zagrożeniem. To fizjologia, a nie Twój charakter.
          </p>
        </div>

        {/* Fiszka 3 – Parentyfikacja / Wewnętrzne Dziecko */}
        <div className="bg-zinc-900 rounded-2xl p-8">
          <Heart className="w-10 h-10 text-emerald-400/50 mb-5" strokeWidth={1.5} />
          <p className="text-xl leading-relaxed text-zinc-300">
            Mała dziewczynka, która musiała pilnować, żeby w domu był spokój?
            Wykonała niesamowitą robotę. Ale ona może już odpocząć. Teraz to nie
            jest jej rola. Nigdy nie powinna była nią być.
          </p>
        </div>
      </div>
    </div>
  )
}
