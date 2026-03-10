import { useState, useEffect } from 'react'
import { ArrowLeft, Crown, Plus, Star } from 'lucide-react'
import { getSuccesses, addSuccess, syncFromCloud } from '../lib/storage'

export default function SloikSukcesow({ navigate, userId }) {
  const [successes, setSuccesses] = useState([])
  const [newText, setNewText] = useState('')

  useEffect(() => {
    setSuccesses(getSuccesses(userId))

    // Próba synchronizacji z chmurą (fire-and-forget)
    syncFromCloud(userId).then((merged) => {
      if (merged) setSuccesses(merged)
    })
  }, [userId])

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

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-8">Słoik Sukcesów</h2>

      {/* Hardcoded crown item – najważniejszy sukces */}
      <div className="bg-amber-950/20 border border-amber-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <Crown className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xl text-amber-200 font-light leading-relaxed">
            Przeżyłam i nasz syn ma rozwiniętą inteligencję emocjonalną.
          </p>
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
          className="flex-1 bg-zinc-900 text-zinc-200 rounded-2xl px-5 py-4 border border-zinc-800 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-600 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="bg-zinc-900 rounded-2xl px-5 border border-zinc-800 disabled:opacity-30 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 text-zinc-400" />
        </button>
      </div>

      {/* Lista sukcesów */}
      <div className="space-y-3">
        {successes.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 rounded-2xl p-5 flex items-start gap-4"
          >
            <Star className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-zinc-300 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {successes.length === 0 && (
        <p className="text-center text-zinc-600 mt-4">
          Twój słoik czeka na pierwszy wpis.
        </p>
      )}
    </div>
  )
}
