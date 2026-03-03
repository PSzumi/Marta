import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from './supabase'

/**
 * Hook do komunikacji Realtime przez Supabase broadcast.
 * Broadcast = peer-to-peer, zero tabel, zero RLS.
 */
export function useRealtimeChannel(channelName, onMessage) {
  const [connected, setConnected] = useState(false)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    })

    channel
      .on('broadcast', { event: 'ping' }, (payload) => {
        onMessage?.(payload.payload)
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
      setConnected(false)
    }
  }, [channelName])

  const sendPing = useCallback((payload) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'ping',
      payload,
    })
  }, [])

  return { connected, sendPing }
}
