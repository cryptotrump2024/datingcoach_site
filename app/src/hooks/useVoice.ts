import { useCallback, useEffect, useRef, useState } from 'react'

// Minimal Web Speech API typings (lib.dom omits SpeechRecognition)
interface SpeechRecognitionResultEvent {
  resultIndex: number
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: { error: string }) => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

// Distinct voice character per archetype (subtle, not cartoonish)
const ARCHETYPE_VOICE: Record<string, { rate: number; pitch: number }> = {
  'The Romantic': { rate: 0.95, pitch: 1.12 },
  'The Intellectual': { rate: 0.92, pitch: 1.0 },
  'The Free Spirit': { rate: 1.08, pitch: 1.18 },
  'The Girl Next Door': { rate: 1.0, pitch: 1.1 },
  'The Diva': { rate: 0.95, pitch: 1.05 },
  'The Mysterious': { rate: 0.88, pitch: 0.98 },
}

const LS_VOICE_ENABLED = 'datingcoach_voice_enabled'

export interface UseVoiceResult {
  speechSupported: boolean
  ttsSupported: boolean
  listening: boolean
  startListening: () => void
  stopListening: () => void
  voiceEnabled: boolean
  setVoiceEnabled: (on: boolean) => void
  speak: (text: string, archetype?: string) => void
  stopSpeaking: () => void
}

export function useVoice(onTranscript: (text: string) => void): UseVoiceResult {
  const Ctor = getRecognitionCtor()
  const speechSupported = Ctor !== null
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabledState] = useState(
    () => ttsSupported && localStorage.getItem(LS_VOICE_ENABLED) === '1'
  )
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  onTranscriptRef.current = onTranscript

  const setVoiceEnabled = useCallback(
    (on: boolean) => {
      setVoiceEnabledState(on)
      try {
        localStorage.setItem(LS_VOICE_ENABLED, on ? '1' : '0')
      } catch {
        /* ignore */
      }
      if (!on && ttsSupported) window.speechSynthesis.cancel()
    },
    [ttsSupported]
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (!Ctor || listening) return
    const recognition = new Ctor()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onresult = (e) => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      onTranscriptRef.current(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }, [Ctor, listening])

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!ttsSupported) return null
    const voices = window.speechSynthesis.getVoices()
    const en = voices.filter((v) => v.lang.startsWith('en'))
    return (
      en.find((v) => /female|samantha|victoria|karen|zira|jenny|aria/i.test(v.name)) ??
      en[0] ??
      voices[0] ??
      null
    )
  }, [ttsSupported])

  const speak = useCallback(
    (text: string, archetype?: string) => {
      if (!ttsSupported) return
      const utterance = new SpeechSynthesisUtterance(
        // strip emoji so the synthesizer doesn't read them out
        text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim()
      )
      const voice = pickVoice()
      if (voice) utterance.voice = voice
      const style = (archetype && ARCHETYPE_VOICE[archetype]) || { rate: 1.0, pitch: 1.08 }
      utterance.rate = style.rate
      utterance.pitch = style.pitch
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    },
    [ttsSupported, pickVoice]
  )

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel()
  }, [ttsSupported])

  useEffect(
    () => () => {
      recognitionRef.current?.abort()
      if (ttsSupported) window.speechSynthesis.cancel()
    },
    [ttsSupported]
  )

  return {
    speechSupported,
    ttsSupported,
    listening,
    startListening,
    stopListening,
    voiceEnabled,
    setVoiceEnabled,
    speak,
    stopSpeaking,
  }
}
