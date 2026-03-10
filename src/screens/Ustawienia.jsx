import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Music, MessageSquareHeart, Sparkles, Crown, Phone, MessageCircle, Plus, X, Check, Trash2 } from 'lucide-react'
import { getSettings, saveSettings, extractSpotifyId, DEFAULTS } from '../lib/userSettings'

export default function Ustawienia({ navigate, userId, onSave }) {
  const current = getSettings(userId)

  const [spotifyUrl, setSpotifyUrl] = useState(
    current.spotifyPlaylistId ? `https://open.spotify.com/playlist/${current.spotifyPlaylistId}` : ''
  )
  const [spotifyError, setSpotifyError] = useState('')

  const [calmingSentences, setCalmingSentences] = useState(
    current.calmingSentences?.length ? current.calmingSentences : [...DEFAULTS.calmingSentences]
  )

  const [affirmations, setAffirmations] = useState(
    current.affirmations?.length ? current.affirmations : [...DEFAULTS.affirmations]
  )
  const [newAffirmation, setNewAffirmation] = useState('')

  const [crownSuccess, setCrownSuccess] = useState(current.crownSuccess || '')

  const [contactName, setContactName] = useState(current.contactName || '')
  const [contactPhone, setContactPhone] = useState(current.contactPhone || '')

  const [messageTemplates, setMessageTemplates] = useState(
    current.messageTemplates?.length ? current.messageTemplates : [...DEFAULTS.messageTemplates]
  )
  const [newTemplate, setNewTemplate] = useState({ label: '', text: '' })

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
      crownSuccess: crownSuccess.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      messageTemplates: messageTemplates.filter(t => t.text.trim()),
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

  const addTemplate = () => {
    if (!newTemplate.text.trim()) return
    setMessageTemplates([...messageTemplates, { label: newTemplate.label.trim() || 'Wiadomość', text: newTemplate.text.trim() }])
    setNewTemplate({ label: '', text: '' })
  }

  const Section = ({ icon: Icon, title, children }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[#6b5f7a]" strokeWidth={1.5} />
        <h3 className="text-[#a99db8] text-sm">{title}</h3>
      </div>
      {children}
    </div>
  )

  return (
    <div className="px-6 py-8 max-w-lg mx-auto pb-20">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-[#6b5f7a] mb-8 active:text-[#d4cde0] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-8">Ustawienia</h2>

      {/* Spotify */}
      <Section icon={Music} title="Playlista Spotify">
        <input
          type="url"
          value={spotifyUrl}
          onChange={(e) => { setSpotifyUrl(e.target.value); setSpotifyError('') }}
          placeholder="https://open.spotify.com/playlist/..."
          className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#3d3449] transition-colors text-sm"
        />
        {spotifyError && <p className="text-rose-400/80 text-sm px-1 mt-2">{spotifyError}</p>}
      </Section>

      {/* Calming sentences */}
      <Section icon={MessageSquareHeart} title="Zdania uspokajające (Stan Czerwony)">
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
              className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
            />
          ))}
        </div>
      </Section>

      {/* Affirmations */}
      <Section icon={Sparkles} title="Przypomnienia (Możesz Odpuścić)">
        <div className="space-y-2 mb-3">
          {affirmations.map((aff, i) => (
            <div key={i} className="flex items-start gap-2">
              <p className="flex-1 bg-[#1c1824] rounded-2xl px-5 py-3 text-[#d4cde0] text-sm leading-relaxed border border-[#2f2a3a]">
                {aff}
              </p>
              <button
                onClick={() => setAffirmations(affirmations.filter((_, idx) => idx !== i))}
                className="p-2 text-[#3d3449] active:text-[#a99db8] transition-colors mt-1 shrink-0"
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
            className="flex-1 bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors text-sm"
          />
          <button
            onClick={addAffirmation}
            disabled={!newAffirmation.trim()}
            className="bg-[#1c1824] rounded-2xl px-4 border border-[#2f2a3a] disabled:opacity-30 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 text-[#a99db8]" />
          </button>
        </div>
      </Section>

      {/* Crown success */}
      <Section icon={Crown} title="Twój największy sukces (Słoik)">
        <textarea
          value={crownSuccess}
          onChange={(e) => setCrownSuccess(e.target.value)}
          rows={3}
          placeholder="Twój największy sukces..."
          className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#3d3449] transition-colors resize-none"
        />
      </Section>

      {/* Contact */}
      <Section icon={Phone} title="Kontakt zaufany (Stan Żółty)">
        <div className="space-y-2">
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Imię (np. Piotrek)"
            className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
          />
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Numer: 48XXXXXXXXX (bez + i spacji)"
            className="w-full bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
          />
        </div>
      </Section>

      {/* Message templates */}
      <Section icon={MessageCircle} title="Szablony wiadomości (Stan Żółty)">
        <div className="space-y-3 mb-3">
          {messageTemplates.map((tmpl, i) => (
            <div key={i} className="bg-[#1c1824] rounded-2xl p-4 border border-[#2f2a3a]">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tmpl.label}
                  onChange={(e) => {
                    const updated = [...messageTemplates]
                    updated[i] = { ...updated[i], label: e.target.value }
                    setMessageTemplates(updated)
                  }}
                  placeholder="Etykieta (np. Bądź obok)"
                  className="flex-1 bg-[#261f30] text-[#d4cde0] rounded-xl px-3 py-2 text-xs border border-[#4a4158] focus:border-zinc-600 focus:outline-none placeholder:text-[#554a63]"
                />
                <button
                  onClick={() => setMessageTemplates(messageTemplates.filter((_, idx) => idx !== i))}
                  className="text-[#3d3449] active:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={tmpl.text}
                onChange={(e) => {
                  const updated = [...messageTemplates]
                  updated[i] = { ...updated[i], text: e.target.value }
                  setMessageTemplates(updated)
                }}
                placeholder="Treść wiadomości..."
                className="w-full bg-[#261f30] text-[#d4cde0] rounded-xl px-3 py-2 text-sm border border-[#4a4158] focus:border-zinc-600 focus:outline-none placeholder:text-[#554a63]"
              />
            </div>
          ))}
        </div>

        {/* Add template */}
        <div className="bg-[#1c1824] rounded-2xl p-4 border border-[#2f2a3a] border-dashed space-y-2">
          <input
            type="text"
            value={newTemplate.label}
            onChange={(e) => setNewTemplate({ ...newTemplate, label: e.target.value })}
            placeholder="Etykieta (np. Potrzebuję pomocy)"
            className="w-full bg-[#261f30] text-[#d4cde0] rounded-xl px-3 py-2 text-xs border border-[#4a4158] focus:border-zinc-600 focus:outline-none placeholder:text-[#554a63]"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newTemplate.text}
              onChange={(e) => setNewTemplate({ ...newTemplate, text: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTemplate() } }}
              placeholder="Treść wiadomości..."
              className="flex-1 bg-[#261f30] text-[#d4cde0] rounded-xl px-3 py-2 text-sm border border-[#4a4158] focus:border-zinc-600 focus:outline-none placeholder:text-[#554a63]"
            />
            <button
              onClick={addTemplate}
              disabled={!newTemplate.text.trim()}
              className="bg-[#261f30] rounded-xl px-3 border border-[#4a4158] disabled:opacity-30 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-[#a99db8]" />
            </button>
          </div>
        </div>
      </Section>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full bg-[#261f30] rounded-2xl py-4 flex items-center justify-center gap-2 text-[#f0ecf5] active:scale-[0.98] transition-transform"
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
