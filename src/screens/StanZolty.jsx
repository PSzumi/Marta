import { ArrowLeft, MessageCircle, Send } from 'lucide-react'
import { DEFAULTS } from '../lib/userSettings'

const waLink = (phone, text) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`

export default function StanZolty({ navigate, settings }) {
  const spotifyId = settings?.spotifyPlaylistId || '37i9dQZF1DXdPec7aLTmlC'
  const contactName = settings?.contactName || 'bliską osobę'
  const contactPhone = settings?.contactPhone || ''
  const templates = settings?.messageTemplates?.length
    ? settings.messageTemplates
    : DEFAULTS.messageTemplates

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
      {contactPhone ? (
        <a
          href={waLink(contactPhone, '')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-zinc-900 rounded-2xl p-8 flex items-center justify-center gap-4 mb-4 active:scale-[0.98] transition-transform block"
        >
          <MessageCircle className="w-10 h-10 text-yellow-400/70" strokeWidth={1.5} />
          <span className="text-2xl text-zinc-200">Napisz do {contactName}</span>
        </a>
      ) : (
        <button
          onClick={() => navigate('ustawienia')}
          className="w-full bg-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 mb-4 border border-zinc-800 border-dashed active:scale-[0.98] transition-transform"
        >
          <MessageCircle className="w-10 h-10 text-zinc-700" strokeWidth={1.5} />
          <span className="text-zinc-500">Dodaj kontakt w ustawieniach</span>
        </button>
      )}

      {/* Gotowe szablony */}
      {contactPhone && (
        <>
          <p className="text-zinc-600 text-sm mb-3 px-1">
            Albo wyślij gotową wiadomość:
          </p>
          <div className="space-y-3 mb-10">
            {templates.map((tmpl, i) => (
              <a
                key={i}
                href={waLink(contactPhone, tmpl.text)}
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
        </>
      )}

      <p className="text-zinc-500 text-center mb-8">
        Bezpieczna dawka dopaminy
      </p>

      {/* Spotify */}
      <div className="mb-6">
        <iframe
          className="w-full rounded-2xl border border-zinc-800"
          style={{ height: '152px' }}
          src={`https://open.spotify.com/embed/playlist/${spotifyId}?utm_source=generator&theme=0`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify"
        />
      </div>

      {/* YouTube */}
      <div>
        <iframe
          className="w-full aspect-video rounded-2xl border border-zinc-800"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="YouTube"
        />
      </div>
    </div>
  )
}
