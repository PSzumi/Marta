import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { migrateAnonymousData } from '../lib/storage'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' && session?.user) {
        migrateAnonymousData(session.user.id)
      }
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase?.auth.signOut()

  return { user, loading, signOut }
}
