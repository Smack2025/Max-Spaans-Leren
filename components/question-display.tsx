"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Volume2 } from "lucide-react"
import { GameWord } from "@/lib/types"

interface QuestionDisplayProps {
  word: GameWord
  speechSupported: boolean
  soundEnabled: boolean
  isSpeaking: boolean
  onSpeak: (word: string) => void
}

export function QuestionDisplay({
  word,
  speechSupported,
  soundEnabled,
  isSpeaking,
  onSpeak,
}: QuestionDisplayProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h2 className="text-5xl font-heading font-bold text-primary">{word.spanish}</h2>
        {speechSupported && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSpeak(word.spanish)}
            disabled={isSpeaking || !soundEnabled}
            className="h-12 w-12 rounded-full bg-transparent hover:bg-primary/10"
            title="Speak Spanish word"
          >
            {isSpeaking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        )}
      </div>
      <p className="text-lg text-muted-foreground font-body">What does this mean in Dutch?</p>
      <p className="text-sm text-muted-foreground font-body mt-1">Use keys 1-4 to select answers</p>
      <p className="text-xs text-primary font-body mt-2">✨ Collect Italian brainrot characters! ✨</p>
    </div>
  )
}

