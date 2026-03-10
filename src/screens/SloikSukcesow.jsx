import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Crown, Plus, Star, Trash2, Check, Pencil } from 'lucide-react'
import { getSuccesses, addSuccess, removeSuccess, editSuccess, syncFromCloud } from '../lib/storage'
import { saveSettings } from '../lib/userSettings'

export default function SloikSukcesow({ navigate, userId, settings, onSettingsChange }) {
  const [successes, setSuccesses] = useState([])
  const [newText, setNewText] = useState('')

  // Crown item editing
  const [editingCrown, setEditingCrown] = useState(false)
  const [crownDraft, setCrownDraft] = useState('')
  const crownInputRef = useRef(null)

  // Inline editing of success items
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState('')

  const crownText = settings?.crownSuccess || ''

  useEffect(() => {
    setSuccesses(getSuccesses(userId))
    syncFromCloud(userId).then((merged) => {
      if (merged) setSuccesses(merged)
    })
  }, [userId])

  useEffect(() => {
    if (editingCrown && crownInputRef.current) {
      crownInputRef.current.focus()
    }
  }, [editingCrown])

  const handleAdd = () => {
    if (!newText.trim()) return
    const updated = addSuccess(newText.trim(), userId)
    setSuccesses(updated)
    setNewText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleDelete = (id) => {
    const updated = removeSuccess(id, userId)
    setSuccesses(updated)
  }

  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditDraft(item.text)
  }

  const handleSaveEdit = (id) => {
    if (!editDraft.trim()) return
    const updated = editSuccess(id, editDraft.trim(), userId)
    setSuccesses(updated)
    setEditingId(null)
  }

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit(id)
    }
    if (e.key === 'Escape') setEditingId(null)
  }

  const handleStartCrownEdit = () => {
    setCrownDraft(crownText)
    setEditingCrown(true)
  }

  const handleSaveCrown = () => {
    saveSettings(userId, { ...settings, crownSuccess: crownDraft.trim() })
    setEditingCrown(false)
    onSettingsChange?.()
  }

  const handleCrownKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveCrown()
    }
    if (e.key === 'Escape') setEditingCrown(false)
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

      <h2 className="text-2xl font-light mb-8">Słoik Sukcesów</h2>

      {/* Crown item — edytowalny */}
      <div className="bg-amber-950/20 border border-amber-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <Crown className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="flex-1">
            {editingCrown ? (
              <div className="flex flex-col gap-3">
                <textarea
                  ref={crownInputRef}
                  value={crownDraft}
                  onChange={(e) => setCrownDraft(e.target.value)}
                  onKeyDown={handleCrownKeyDown}
                  rows={3}
                  className="w-full bg-amber-950/30 text-amber-200 rounded-xl px-4 py-3 border border-amber-700/40 focus:border-amber-600/60 focus:outline-none resize-none placeholder:text-amber-800/60 text-xl font-light leading-relaxed"
                  placeholder="Twój największy sukces..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveCrown}
                    className="flex items-center gap-1.5 bg-amber-900/40 rounded-xl px-4 py-2 text-amber-300 text-sm active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" />
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditingCrown(false)}
                    className="text-amber-800 text-sm px-3 py-2"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartCrownEdit}
                className="text-left w-full group"
              >
                {crownText ? (
                  <p className="text-xl text-amber-200 font-light leading-relaxed group-active:opacity-70 transition-opacity">
                    {crownText}
                  </p>
                ) : (
                  <p className="text-xl text-amber-800/60 font-light leading-relaxed italic">
                    Dotknij, żeby wpisać swój największy sukces...
                  </p>
                )}
                <span className="flex items-center gap-1 mt-2 text-amber-700/60 text-xs opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                  <Pencil className="w-3 h-3" />
                  edytuj
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dodawanie nowego sukcesu */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Dodaj mały sukces..."
          className="flex-1 bg-[#1c1824] text-[#f0ecf5] rounded-2xl px-5 py-4 border border-[#2f2a3a] focus:border-[#4a4158] focus:outline-none placeholder:text-[#554a63] transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="bg-[#1c1824] rounded-2xl px-5 border border-[#2f2a3a] disabled:opacity-30 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 text-[#a99db8]" />
        </button>
      </div>

      {/* Lista sukcesów */}
      <div className="space-y-3">
        {successes.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c1824] rounded-2xl p-5 flex items-start gap-4 group"
          >
            <Star className="w-5 h-5 text-[#554a63] shrink-0 mt-0.5" strokeWidth={1.5} />

            {editingId === item.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                  autoFocus
                  className="w-full bg-[#261f30] text-[#f0ecf5] rounded-xl px-4 py-2 border border-[#4a4158] focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="flex items-center gap-1 bg-[#2f2a3a] rounded-lg px-3 py-1.5 text-[#d4cde0] text-xs active:scale-95 transition-transform"
                  >
                    <Check className="w-3 h-3" />
                    Zapisz
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-[#554a63] text-xs px-2 py-1.5"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleStartEdit(item)}
                  className="flex-1 text-left text-[#d4cde0] leading-relaxed active:opacity-70 transition-opacity"
                >
                  {item.text}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[#261f30] hover:text-[#554a63] active:text-rose-400 transition-colors shrink-0 p-1 -mr-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                  aria-label="Usuń"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {successes.length === 0 && (
        <p className="text-center text-[#554a63] mt-4">
          Twój słoik czeka na pierwszy wpis.
        </p>
      )}
    </div>
  )
}
