import { ArrowLeft, MessageCircle, Send } from 'lucide-react'

// ─── Gotowe szablony wiadomości WhatsApp ───
// Formułowanie słów w kryzysie = funkcja wykonawcza = offline.
// Dlatego dajemy gotowe wiadomości jednym kliknięciem.
const messageTemplates = [
  {
    text: 'Piotrek, potrzebuję, żebyś po prostu był obok mnie.',
    label: 'Bądź obok',
  },
  {
    text: 'Piotrek, źle się czuję. Czy możesz do mnie przyjść?',
    label: 'Przyjdź do mnie',
  },
  {
    text: 'Piotrek, nie umiem teraz mówić, ale potrzebuję Cię.',
    label: 'Nie umiem mówić',
  },
]

const PHONE_NUMBER = '48502112113'
const waLink = (text) =>
  `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`

export default function StanZolty({ navigate }) {
  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-2">Stan Żółty</h2>
      <p className="text-zinc-500 mb-8">Nie musisz tego robić sama.</p>

      {/* Główny przycisk WhatsApp */}
      <a
        href={waLink('')}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-zinc-900 rounded-2xl p-8 flex items-center justify-center gap-4 mb-4 active:scale-[0.98] transition-transform block"
      >
        <MessageCircle className="w-10 h-10 text-yellow-400/70" strokeWidth={1.5} />
        <span className="text-2xl text-zinc-200">Napisz do Piotrka</span>
      </a>

      {/* Gotowe szablony – jedno kliknięcie */}
      <p className="text-zinc-600 text-sm mb-3 px-1">
        Albo wyślij gotową wiadomość:
      </p>
      <div className="space-y-3 mb-10">
        {messageTemplates.map((tmpl, i) => (
          <a
            key={i}
            href={waLink(tmpl.text)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-zinc-900 rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform block"
          >
            <Send className="w-5 h-5 text-zinc-600 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-zinc-400 text-sm mb-0.5">{tmpl.label}</div>
              <div className="text-zinc-300">{tmpl.text}</div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-zinc-500 text-center mb-8">
        Bezpieczna dawka dopaminy
      </p>

      {/* Spotify – podmień src na swój link embed */}
      <div className="mb-6">
        <iframe
          className="w-full rounded-2xl border border-zinc-800"
          style={{ height: '152px' }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC?utm_source=generator&theme=0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify – energia"
        />
      </div>

      {/* YouTube – podmień src na swój link embed */}
      <div>
        <iframe
          className="w-full aspect-video rounded-2xl border border-zinc-800"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="YouTube – energia"
        />
      </div>
    </div>
  )
}
