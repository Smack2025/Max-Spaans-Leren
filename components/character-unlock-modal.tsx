"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BRAINROT_CHARACTERS } from "./italian-brainrot-characters"

interface CharacterUnlockModalProps {
  characterId: string
  onClose: () => void
}

export function CharacterUnlockModal({ characterId, onClose }: CharacterUnlockModalProps) {
  const character = BRAINROT_CHARACTERS.find((c) => c.id === characterId)
  if (!character) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm mx-4 bounce-in">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🎉✨</div>
          <h2 className="text-2xl font-heading font-bold mb-4">NEW CHARACTER!</h2>
          <img
            src={character.image || "/placeholder.svg"}
            alt={character.name}
            className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-500 mb-4"
          />
          <h3 className="text-xl font-heading font-bold mb-2">{character.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{character.description}</p>
          <Button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading"
          >
            Awesome!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

