import { supabase } from './supabase'

const LEGACY_KEY = 'przystan_successes'

function storageKey(userId) {
  return userId ? `przystan_successes_${userId}` : LEGACY_KEY
}

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

// Przenosi dane anonimowe (stary klucz) na klucz usera przy pierwszym logowaniu
export function migrateAnonymousData(userId) {
  if (!userId) return
  const newKey = storageKey(userId)
  const oldData = localStorage.getItem(LEGACY_KEY)
  const newData = localStorage.getItem(newKey)
  if (oldData && !newData) {
    localStorage.setItem(newKey, oldData)
    localStorage.removeItem(LEGACY_KEY)
  }
}

export function getSuccesses(userId) {
  return readLocal(storageKey(userId))
}

export function addSuccess(text, userId) {
  const key = storageKey(userId)
  const item = {
    id: crypto.randomUUID(),
    text,
    created_at: new Date().toISOString(),
  }
  const items = readLocal(key)
  items.unshift(item)
  writeLocal(key, items)

  // Fire-and-forget sync do Supabase (jeśli skonfigurowany)
  if (supabase && userId) {
    supabase
      .from('successes')
      .insert({ text, created_at: item.created_at, user_id: userId })
      .then(() => {})
      .catch(() => {})
  }

  return items
}

export function removeSuccess(id, userId) {
  const key = storageKey(userId)
  const items = readLocal(key).filter((item) => item.id !== id)
  writeLocal(key, items)
  return items
}

export async function syncFromCloud(userId) {
  if (!supabase || !userId) return null

  try {
    const { data, error } = await supabase
      .from('successes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error || !data) return null

    // Merge: zachowaj lokalne + dodaj z chmury których nie ma lokalnie
    const key = storageKey(userId)
    const local = readLocal(key)
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
      writeLocal(key, merged)
      return merged
    }

    return local
  } catch {
    return null
  }
}
