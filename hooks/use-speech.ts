"use client"

import { useEffect, useState } from "react"

export function useSpeech(soundEnabled: boolean) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  const speakWord = (word: string) => {
    if (!speechSupported || isSpeaking) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "es-ES"
    utterance.rate = 0.7
    utterance.pitch = 2.2
    utterance.volume = soundEnabled ? 1 : 0

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const speakWelcomeMessage = () => {
    if (!speechSupported) return

    window.speechSynthesis.cancel()

    const message = "Hello Papacito Max, are you ready to collect Italian Brainrot Figures?"
    const utterance = new SpeechSynthesisUtterance(message)

    utterance.lang = "es-US"
    utterance.rate = 0.7
    utterance.pitch = 2.5
    utterance.volume = 1

    const voices = window.speechSynthesis.getVoices()
    const funnyVoice =
      voices.find(
        (voice) =>
          (voice.lang.startsWith("es") || voice.name.toLowerCase().includes("spanish")) &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("maria") ||
            voice.name.toLowerCase().includes("carmen") ||
            voice.name.toLowerCase().includes("sofia") ||
            voice.name.toLowerCase().includes("isabella")),
      ) ||
      voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("child") ||
          voice.name.toLowerCase().includes("young") ||
          voice.name.toLowerCase().includes("high"),
      ) ||
      voices.find((voice) => voice.lang.startsWith("es"))

    if (funnyVoice) {
      utterance.voice = funnyVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setTimeout(() => {
        if (!isSpeaking) {
          window.speechSynthesis.speak(utterance)
        }
      }, 200)
    }

    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    setSpeechSupported("speechSynthesis" in window)
  }, [])

  useEffect(() => {
    if (speechSupported) {
      speakWelcomeMessage()
      const retryTimers = [
        setTimeout(() => speakWelcomeMessage(), 100),
        setTimeout(() => speakWelcomeMessage(), 500),
        setTimeout(() => speakWelcomeMessage(), 1000),
      ]
      return () => retryTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [speechSupported])

  return { isSpeaking, speechSupported, speakWord, speakWelcomeMessage }
}

