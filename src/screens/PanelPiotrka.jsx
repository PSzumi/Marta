import { useState } from 'react'
import { ArrowLeft, Volume2, ShieldAlert, Sun, BookOpen, Wind, MessageCircle, Send, Wifi, WifiOff } from 'lucide-react'
import { useRealtimeChannel } from '../lib/realtime'

const actions = [
  {
    id: 'play-music',
    label: 'Włącz muzykę',
    icon: Volume2,
    accent: 'text-violet-400/60',
    payload: { action: 'play-music' },
  },
  {
    id: 'breathing',
    label: 'Oddech',
    icon: Wind,
    accent: 'text-blue-400/60',
    payload: { action: 'navigate', screen: 'stan-czerwony', section: 'breathing' },
  },
  {
    id: 'stan-czerwony',
    label: 'Stan Czerwony',
    icon: ShieldAlert,
    accent: 'text-red-400/60',
    payload: { action: 'navigate', screen: 'stan-czerwony' },
  },
  {
    id: 'stan-zolty',
    label: 'Stan Żółty',
    icon: Sun,
    accent: 'text-yellow-400/60',
    payload: { action: 'navigate', screen: 'stan-zolty' },
  },
  {
    id: 'stan-zielony',
    label: 'Stan Zielony',
    icon: BookOpen,
    accent: 'text-emerald-400/60',
    payload: { action: 'navigate', screen: 'stan-zielony' },
  },
]

export default function PanelPiotrka({ navigate }) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(null)
  const { connected, sendPing } = useRealtimeChannel('przystan-ping')

  const handleAction = (payload) => {
    sendPing(payload)
    setSent(payload.action === 'navigate' ? payload.screen : payload.action)
    setTimeout(() => setSent(null), 1500)
  }

  const handleMessage = () => {
    if (!message.trim()) return
    sendPing({ action: 'message', text: message.trim() })
    setSent('message')
    setMessage('')
    setTimeout(() => setSent(null), 1500)
  }

  return (
    <div className="px-4 py-8 max-w-lg mx-auto min-h-dvh flex flex-col">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-6 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light">Panel Piotrka</h2>
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi className="w-4 h-4 text-emerald-500/70" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500/70" />
          )}
          <span className={`text-xs ${connected ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
            {connected ? 'Połączono' : 'Brak połączenia'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {actions.map(({ id, label, icon: Icon, accent, payload }) => (
          <button
            key={id}
            onClick={() => handleAction(payload)}
            disabled={!connected}
            className={`bg-zinc-900 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center active:scale-[0.97] transition-all duration-150 disabled:opacity-30 ${
              sent === (payload.screen || payload.action) ? 'ring-1 ring-zinc-600' : ''
            }`}
          >
            <Icon className={`w-8 h-8 ${accent}`} strokeWidth={1.5} />
            <span className="text-sm text-zinc-300 leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Custom message */}
      <div className="bg-zinc-900 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-zinc-500" strokeWidth={1.5} />
          <span className="text-sm text-zinc-400">Wiadomość dla Marty</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
            placeholder="Napisz coś..."
            disabled={!connected}
            className="flex-1 bg-zinc-800 text-zinc-200 rounded-xl px-4 py-3 border border-zinc-700 focus:border-zinc-600 focus:outline-none placeholder:text-zinc-600 transition-colors disabled:opacity-30"
          />
          <button
            onClick={handleMessage}
            disabled={!connected || !message.trim()}
            className="bg-zinc-800 rounded-xl px-4 border border-zinc-700 disabled:opacity-30 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
        {sent === 'message' && (
          <p className="text-xs text-emerald-500/70 mt-2">Wysłano</p>
        )}
      </div>

      <p className="text-zinc-700 text-xs text-center mt-auto pt-8">
        Pingi działają gdy Marta ma otwartą aplikację
      </p>
    </div>
  )
}
