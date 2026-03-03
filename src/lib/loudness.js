import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Hook do detekcji głośności mikrofonu (foreground-only).
 * Używa Web Audio API: getUserMedia → AnalyserNode → RMS.
 *
 * @param {Object} opts
 * @param {number} opts.threshold - Próg głośności 0-1 (domyślnie 0.15)
 * @param {number} opts.sustainMs - Ile ms musi trwać przekroczenie (domyślnie 2000)
 * @param {number} opts.cooldownMs - Cooldown między alertami (domyślnie 60000)
 * @param {Function} opts.onLoud - Callback gdy wykryto głośność
 */
export function useLoudnessDetector({ threshold = 0.15, sustainMs = 2000, cooldownMs = 60000, onLoud } = {}) {
  const [isListening, setIsListening] = useState(false)
  const [volume, setVolume] = useState(0)
  const contextRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)
  const sustainStartRef = useRef(null)
  const lastAlertRef = useRef(0)

  const stop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (contextRef.current) {
      contextRef.current.close().catch(() => {})
      contextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    sustainStartRef.current = null
    setVolume(0)
    setIsListening(false)
  }, [])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new AudioContext()
      contextRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)

      const dataArray = new Uint8Array(analyser.fftSize)
      setIsListening(true)

      const measure = () => {
        if (!contextRef.current) return

        analyser.getByteTimeDomainData(dataArray)

        // RMS calculation
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128
          sum += val * val
        }
        const rms = Math.sqrt(sum / dataArray.length)
        setVolume(rms)

        // Sprawdź czy przekroczono próg
        const now = Date.now()
        if (rms > threshold) {
          if (!sustainStartRef.current) {
            sustainStartRef.current = now
          } else if (now - sustainStartRef.current > sustainMs) {
            // Przekroczono próg przez wystarczająco długo
            if (now - lastAlertRef.current > cooldownMs) {
              lastAlertRef.current = now
              sustainStartRef.current = null
              onLoud?.()
            }
          }
        } else {
          sustainStartRef.current = null
        }

        animFrameRef.current = requestAnimationFrame(measure)
      }

      measure()
    } catch (err) {
      console.warn('Microphone access denied:', err)
      setIsListening(false)
    }
  }, [threshold, sustainMs, cooldownMs, onLoud])

  // Cleanup on unmount
  useEffect(() => {
    return () => stop()
  }, [stop])

  return { volume, isListening, start, stop }
}
