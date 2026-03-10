import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Music, MessageSquareHeart, Sparkles, Plus, X, Check } from 'lucide-react'
import { getSettings, saveSettings, extractSpotifyId, DEFAULTS } from '../lib/userSettings'

export default function Ustawienia({ navigate, userId, onSave }) {
  const current = getSettings(userId)

  const [spotifyUrl, setSpotifyUrl] = useState(
    current.spotifyPlaylistId
      ? `https://open.spotify.com/playlist/${current.spotifyPlaylistId}`
      : ''
  )
  const [spotifyError, setSpotifyError] = useState('')
  const [calmingSentences, setCalmingSentences] = useState(
    current.calmingSentences?.length ? current.calmingSentences : [...DEFAULTS.calmingSentences]
  )
  const [affirmations, setAffirmations] = useState(
    current.affirmations?.length ? current.affirmations : [...DEFAULTS.affirmations]
  )
  const [newAffirmation, setNewAffirmation] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (spotifyUrl.trim() && !extractSpotifyId(spotifyUrl)) {
      setSpotifyError('Wklej pełny link do playlisty, np. https://open.spotify.com/playlist/...')
      return
    }
    saveSettings(userId, {
      ...current,
      spotifyPlaylistId: extractSpotifyId(spotifyUrl) || '',
      calmingSentences: calmingSentences.filter(s => s.trim()),
      affirmations: affirmations.filter(s => s.trim()),
    })
    onSave()
    setSaved(true)
    setTimeout(() => navigate('home'), 800)
  }

  const addAffirmation = () => {
    if (!newAffirmation.trim()) return
    setAffirmations([...affirmations, newAffirmation.trim()])
    setNewAffirmation('')
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

      <h2 className="text-2xl font-light mb-8">Ustawienia</h2>

      {/* Spotify */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
          <h3 className="text-zinc-400 text-sm">Playlista Spotify</h3>
        </div>
        <input
          type="url"
          value={spotifyUrl}
          onChange={(e) => { setSpotifyUrl(e.target.value); setSpotifyError('') }}
          placeholder="https://open.spotify.com/playlist/..."
          className="w-full bg-zinc-900 text-zinc-200 rounded-2xl px-5 py-4 border border-zinc-800 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-700 transition-colors text-sm"
        />
        {spotifyError && <p className="text-rose-400/80 text-sm px-1 mt-2">{spotifyError}</p>}
      </div>

      {/* Calming sentences */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareHeart className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
          <h3 className="text-zinc-400 text-sm">Zdania uspokajające (Stan Czerwony)</h3>
        </div>
        <div className="space-y-2">
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
        </div>
      </div>

      {/* Affirmations */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
          <h3 className="text-zinc-400 text-sm">Przypomnienia (Możesz Odpuścić)</h3>
        </div>
        <div className="space-y-2 mb-3">
          {affirmations.map((aff, i) => (
            <div key={i} className="flex items-start gap-2">
              <p className="flex-1 bg-zinc-900 rounded-2xl px-5 py-3 text-zinc-300 text-sm leading-relaxed border border-zinc-800">
                {aff}
              </p>
              <button
                onClick={() => setAffirmations(affirmations.filter((_, idx) => idx !== i))}
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
            placeholder="Dodaj zdanie..."
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

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full bg-zinc-800 rounded-2xl py-4 flex items-center justify-center gap-2 text-zinc-200 active:scale-[0.98] transition-transform"
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Zapisano
            </motion.span>
          ) : (
            <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Zapisz zmiany
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  )
}
