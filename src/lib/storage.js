import { supabase } from './supabase'

const STORAGE_KEY = 'przystan_successes'

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getSuccesses() {
  return readLocal()
}

export function addSuccess(text) {
  const item = {
    id: crypto.randomUUID(),
    text,
    created_at: new Date().toISOString(),
  }
  const items = readLocal()
  items.unshift(item)
  writeLocal(items)

  // Fire-and-forget sync do Supabase (jeśli skonfigurowany)
  if (supabase) {
    supabase
      .from('successes')
      .insert({ text, created_at: item.created_at })
      .then(() => {})
      .catch(() => {})
  }

  return items
}

export function removeSuccess(id) {
  const items = readLocal().filter((item) => item.id !== id)
  writeLocal(items)
  return items
}

export async function syncFromCloud() {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('successes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return null

    // Merge: zachowaj lokalne + dodaj z chmury których nie ma lokalnie
    const local = readLocal()
    const localTexts = new Set(local.map((i) => i.text))
    const newFromCloud = data
      .filter((item) => !localTexts.has(item.text))
      .map((item) => ({
        id: item.id,
        text: item.text,
        created_at: item.created_at,
      }))

    if (newFromCloud.length > 0) {
      const merged = [...local, ...newFromCloud].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
      writeLocal(merged)
      return merged
    }

    return local
  } catch {
    return null
  }
}
