"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Settings, Volume2, VolumeX, Sparkles } from "lucide-react"
import { DifficultySelector } from "./difficulty-selector"
import { AchievementSystem } from "./achievement-system"
import { SoundManager } from "./sound-manager"
import { BrainrotCollection, getRandomCharacterToUnlock, BRAINROT_CHARACTERS } from "./italian-brainrot-characters"
import { getWordsByDifficulty } from "@/lib/words-data"
import { QuestionDisplay } from "./question-display"
import { AnswerOptions } from "./answer-options"
import { CharacterUnlockModal } from "./character-unlock-modal"
import { useSpeech } from "@/hooks/use-speech"
import { GameWord } from "@/lib/types"

export function SpanishLearningGame() {
  const [gameMode, setGameMode] = useState<"welcome" | "select" | "playing" | "collection">("welcome") // Added welcome mode as initial state
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [words, setWords] = useState<GameWord[]>([])
  const [loading, setLoading] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [animationClass, setAnimationClass] = useState("")
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [playCorrectSound, setPlayCorrectSound] = useState(false)
  const [playIncorrectSound, setPlayIncorrectSound] = useState(false)
  const [playCompleteSound, setPlayCompleteSound] = useState(false)

  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>([])
  const [newlyUnlockedCharacter, setNewlyUnlockedCharacter] = useState<string | null>(null)
  const [showCharacterUnlock, setShowCharacterUnlock] = useState(false)

  const { speechSupported, isSpeaking, speakWord, speakWelcomeMessage } = useSpeech(soundEnabled)

  const [gameAnswers, setGameAnswers] = useState<
    Array<{
      question: string
      correctAnswer: string
      userAnswer: string
      isCorrect: boolean
      difficulty: number
      timestamp: number
    }>
  >([])

  useEffect(() => {
    const saved = localStorage.getItem("brainrot-collection")
    if (saved) {
      setUnlockedCharacters(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (unlockedCharacters.length > 0) {
      localStorage.setItem("brainrot-collection", JSON.stringify(unlockedCharacters))
    }
  }, [unlockedCharacters])

  useEffect(() => {
    if (currentWord && speechSupported && gameMode === "playing" && !showResult) {
      // Auto-speak the word after a short delay
      const timer = setTimeout(() => {
        speakWord(currentWord.spanish)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, gameMode, showResult, currentWord, speechSupported, speakWord])


  const loadWords = async (difficulty?: number) => {
    setLoading(true)
    try {
      const url = difficulty ? `/api/game/words?difficulty=${difficulty}` : "/api/game/words"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setWords(data.words)
        setGameStartTime(Date.now())
      } else {
        console.error("Failed to load words")
        const fallbackWords = getWordsByDifficulty(difficulty)
        const gameWords = fallbackWords.map((word) => {
          const otherWords = fallbackWords.filter((w) => w.id !== word.id)
          const incorrectOptions = otherWords
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w) => ({ text: w.dutch_translation }))

          const correctOption = { text: word.dutch_translation }
          const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5)

          return {
            id: word.id,
            spanish: word.spanish_word,
            dutch: word.dutch_translation,
            image: word.image_url,
            options: allOptions,
            difficulty: word.difficulty_level,
          }
        })
        setWords(gameWords)
      }
    } catch (error) {
      console.error("Error loading words:", error)
      const fallbackWords = getWordsByDifficulty(difficulty)
      const gameWords = fallbackWords.map((word) => {
        const otherWords = fallbackWords.filter((w) => w.id !== word.id)
        const incorrectOptions = otherWords
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((w) => ({ text: w.dutch_translation }))

        const correctOption = { text: word.dutch_translation }
        const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          id: word.id,
          spanish: word.spanish_word,
          dutch: word.dutch_translation,
          image: word.image_url,
          options: allOptions,
          difficulty: word.difficulty_level,
        }
      })
      setWords(gameWords)
    } finally {
      setLoading(false)
    }
  }

  const handleDifficultySelect = (level: number) => {
    setSelectedDifficulty(level)
    setGameMode("playing")
    loadWords(level)
  }

  const handlePlayAll = () => {
    setSelectedDifficulty(null)
    setGameMode("playing")
    loadWords()
  }

  const currentWord = words[currentWordIndex]

  const handleAnswerSelect = async (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    const correct = answer === currentWord.dutch
    setIsCorrect(correct)
    setShowResult(true)

    const answerRecord = {
      question: currentWord.spanish,
      correctAnswer: currentWord.dutch,
      userAnswer: answer,
      isCorrect: correct,
      difficulty: currentWord.difficulty,
      timestamp: Date.now(),
    }
    setGameAnswers((prev) => [...prev, answerRecord])

    if (correct) {
      setScore(score + 1)
      setStreak(streak + 1)
      setMaxStreak(Math.max(maxStreak, streak + 1))
      setAnimationClass("celebration")

      if ((score + 1) % 2 === 0) {
        // Every 2 correct answers
        const newCharacter = getRandomCharacterToUnlock(unlockedCharacters)
        if (newCharacter) {
          setNewlyUnlockedCharacter(newCharacter)
          setUnlockedCharacters((prev) => [...prev, newCharacter])
          setShowCharacterUnlock(true)
        }
      }

      if (soundEnabled) {
        setPlayCorrectSound(true)
      }
    } else {
      setStreak(0) // Reset streak on wrong answer
      if (soundEnabled) {
        setPlayIncorrectSound(true)
      }
    }

    setTimeout(() => {
      nextWord()
    }, 2000)
  }

  const nextWord = () => {
    setAnimationClass("")
    setSelectedAnswer(null)
    setShowResult(false)

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      setGameComplete(true)
      if (soundEnabled) {
        setPlayCompleteSound(true)
      }
      saveGameSession()
    }
  }

  const saveGameSession = async () => {
    const userId = "guest"
    const sessionDuration = Math.floor((Date.now() - gameStartTime) / 1000)

    try {
      // Save game session
      await fetch("/api/game/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          score,
          totalQuestions: words.length,
          correctAnswers: score,
          sessionDuration,
        }),
      })

      // Update progress for each word
      for (let i = 0; i <= currentWordIndex; i++) {
        const word = words[i]
        if (word) {
          await fetch("/api/game/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              wordId: word.id,
              isCorrect: true, // All answers are correct in this game
            }),
          })
        }
      }
    } catch (error) {
      console.error("Error saving game session:", error)
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setStreak(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameComplete(false)
    setAnimationClass("")
    setGameStartTime(Date.now())
    setShowCharacterUnlock(false)
    setNewlyUnlockedCharacter(null)
    setGameAnswers([])
  }

  const backToMenu = () => {
    setGameMode("select")
    setWords([])
    resetGame()
  }

  const showCollection = () => {
    setGameMode("collection")
  }

  const GameHeader = () => (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={showCollection} className="h-8 px-3 font-body bg-transparent">
        <Sparkles className="w-3 h-3 mr-1" />
        {unlockedCharacters.length}/{BRAINROT_CHARACTERS.length}
      </Button>
      {(gameComplete || gameAnswers.length > 0) && (
        <Button variant="outline" size="sm" onClick={exportGameData} className="h-8 px-3 font-body bg-transparent">
          📊 Export
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="h-8 px-3 font-body bg-transparent"
      >
        {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
      </Button>
    </div>
  )

  const handleSoundPlayed = () => {
    setPlayCorrectSound(false)
    setPlayIncorrectSound(false)
    setPlayCompleteSound(false)
  }

  const speakWord = (word: string) => {
    if (!speechSupported || isSpeaking) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "es-ES" // Spanish language
    utterance.rate = 0.7 // Slower speed for children to understand better
    utterance.pitch = 2.2 // Keep very high pitch for funny squeaky voice
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

    utterance.lang = "es-US" // Spanish locale for Spanish-accented English
    utterance.rate = 0.7 // Slower speed for children to understand better
    utterance.pitch = 2.5 // Keep extremely high pitch for hilarious squeaky voice
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
      voices.find((voice) => voice.lang.startsWith("es")) // Final fallback to any Spanish voice

    if (funnyVoice) {
      utterance.voice = funnyVoice
    }

    utterance.onstart = () => {
      console.log("[v0] Funny welcome message started playing")
      setIsSpeaking(true)
    }
    utterance.onend = () => {
      console.log("[v0] Funny welcome message finished playing")
      setIsSpeaking(false)
    }
    utterance.onerror = (event) => {
      console.log("[v0] Funny welcome message error:", event.error)
      setIsSpeaking(false)
      setTimeout(() => {
        if (!isSpeaking) {
          window.speechSynthesis.speak(utterance)
        }
      }, 200)
    }

    console.log("[v0] Attempting to speak funny welcome message")
    window.speechSynthesis.speak(utterance)
  }

  const dismissWelcome = () => {
    setGameMode("select")
  }

  const exportGameData = () => {
    const exportData = {
      gameSession: {
        timestamp: new Date().toISOString(),
        difficulty: selectedDifficulty,
        totalQuestions: words.length,
        score: score,
        maxStreak: maxStreak,
        sessionDuration: Math.floor((Date.now() - gameStartTime) / 1000),
        accuracy: words.length > 0 ? Math.round((score / words.length) * 100) : 0,
      },
      answers: gameAnswers,
      unlockedCharacters: unlockedCharacters.map((id) => {
        const character = BRAINROT_CHARACTERS.find((c) => c.id === id)
        return {
          id,
          name: character?.name || "Unknown",
          description: character?.description || "",
        }
      }),
      vocabulary: words.map((word) => ({
        spanish: word.spanish,
        dutch: word.dutch,
        difficulty: word.difficulty,
        options: word.options.map((opt) => opt.text),
      })),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `spanish-learning-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (gameMode === "collection") {
    return <BrainrotCollection unlockedCharacters={unlockedCharacters} onClose={() => setGameMode("select")} />
  }

  if (gameMode === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 to-orange-50" />
        <Card className="w-full max-w-lg mx-4 bounce-in relative z-10">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <img
                src="/sahur-tung-tung-tung-sahur.gif"
                alt="Tung Tung Tung Sahur"
                className={`w-32 h-32 mx-auto rounded-full border-4 border-primary shadow-lg mb-4 ${isSpeaking ? "animate-bounce" : "animate-pulse"}`}
              />
              <div className="text-6xl mb-4">🎉✨</div>
            </div>

            <h1 className="text-3xl font-heading font-bold text-primary mb-4">Ciao Max! 🇮🇹</h1>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 mb-6 border-2 border-yellow-300">
              <p className="text-xl font-body text-gray-800 leading-relaxed">
                "Hello Papacito Max, are you ready to collect Italian Brainrot Figures?"
              </p>
              <p className="text-sm text-gray-600 mt-2 font-body italic">- Tung Tung Tung Sahur, the Walking Log</p>
              {isSpeaking && (
                <div className="flex items-center justify-center mt-2 text-primary">
                  <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
                  <span className="text-xs">Speaking...</span>
                </div>
              )}
              {speechSupported && (
                <Button
                  onClick={speakWelcomeMessage}
                  variant="outline"
                  size="sm"
                  className="mt-3 mx-auto flex items-center gap-2 bg-transparent"
                  disabled={isSpeaking}
                >
                  {isSpeaking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />🔊 Play Welcome Message
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="mb-6">
              <p className="text-lg text-muted-foreground font-body mb-2">
                Learn Spanish words and unlock amazing Italian brainrot characters!
              </p>
              <div className="flex justify-center gap-2 text-sm text-muted-foreground font-body">
                <span>🦈 Tralalero Tralalá</span>
                <span>🐵 Chimpanzini Bananini</span>
                <span>🐊 Bombardiro Crocodilo</span>
              </div>
            </div>

            <Button
              onClick={dismissWelcome}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading text-xl px-8 py-4"
            >
              Let's Collect Brainrot! 🚀
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameMode === "select") {
    return (
      <div className="relative">
        <GameHeader />
        <DifficultySelector onSelectDifficulty={handleDifficultySelect} onPlayAll={handlePlayAll} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">Loading Game...</h2>
            <p className="text-muted-foreground font-body">Preparing your Spanish learning experience</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">No Words Available</h2>
            <p className="text-muted-foreground font-body mb-4">
              Please check your database connection or contact support.
            </p>
            <Button onClick={backToMenu} variant="outline" className="font-body bg-transparent">
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameComplete) {
    const perfectGame = score === words.length
    const newCharacter = newlyUnlockedCharacter
      ? BRAINROT_CHARACTERS.find((c) => c.id === newlyUnlockedCharacter)
      : null

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <GameHeader />
        <SoundManager
          playCorrect={playCorrectSound}
          playIncorrect={playIncorrectSound}
          playComplete={playCompleteSound}
          onSoundPlayed={handleSoundPlayed}
        />
        <Card className="w-full max-w-md text-center bounce-in">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">¡Brainrot Completado!</h1>
            <p className="text-xl text-muted-foreground mb-4 font-body">
              You collected {score} Italian brainrot moments!
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <Badge variant="secondary" className="font-body">
                Max Streak: {maxStreak}
              </Badge>
              <Badge variant="default" className="font-body">
                Characters: {unlockedCharacters.length}/{BRAINROT_CHARACTERS.length}
              </Badge>
            </div>

            {newCharacter && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-2 border-yellow-300">
                <div className="text-2xl mb-2">✨ NEW CHARACTER UNLOCKED! ✨</div>
                <img
                  src={newCharacter.image || "/placeholder.svg"}
                  alt={newCharacter.name}
                  className="w-16 h-16 mx-auto rounded-full border-2 border-yellow-500 mb-2"
                />
                <h3 className="font-heading font-bold text-lg">{newCharacter.name}</h3>
                <p className="text-sm text-muted-foreground">{newCharacter.description}</p>
              </div>
            )}

            <AchievementSystem
              score={score}
              streak={maxStreak}
              totalCorrect={score}
              perfectGames={perfectGame ? 1 : 0}
            />
            <div className="space-y-4 mt-6">
              <Button
                onClick={exportGameData}
                variant="outline"
                className="w-full py-3 font-heading bg-transparent mb-2"
              >
                📊 Export All Answers & Progress
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={resetGame}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 font-heading"
                >
                  More Brainrot!
                </Button>
                <Button onClick={showCollection} variant="outline" className="flex-1 py-3 font-heading bg-transparent">
                  View Collection
                </Button>
              </div>
              <Button onClick={backToMenu} variant="ghost" className="w-full font-heading">
                Change Level
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <GameHeader />
      <SoundManager
        playCorrect={playCorrectSound}
        playIncorrect={playIncorrectSound}
        playComplete={playCompleteSound}
        onSoundPlayed={handleSoundPlayed}
      />

      {showCharacterUnlock && newlyUnlockedCharacter && (
        <CharacterUnlockModal
          characterId={newlyUnlockedCharacter}
          onClose={() => setShowCharacterUnlock(false)}
        />
      )}

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-4xl font-heading font-bold text-foreground">Italian Brainrot Collector</h1>
            <Button onClick={backToMenu} variant="ghost" size="sm" className="font-body">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-center items-center gap-4 text-lg flex-wrap">
            <Badge variant="outline" className="px-3 py-1 font-body">
              Question {currentWordIndex + 1} of {words.length}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 font-body">
              Brainrot Points: {score}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-body">
              Streak: {streak}
            </Badge>
            {currentWord && (
              <Badge variant="outline" className="px-3 py-1 font-body">
                Level {currentWord.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Game Card */}
        <Card className={`w-full ${animationClass}`}>
          <CardContent className="p-8">
            <QuestionDisplay
              word={currentWord}
              speechSupported={speechSupported}
              soundEnabled={soundEnabled}
              isSpeaking={isSpeaking}
              onSpeak={speakWord}
            />
            <AnswerOptions
              word={currentWord}
              showResult={showResult}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswerSelect}
            />

            {/* Result Message */}
            {showResult && (
              <div className="text-center mt-6 bounce-in">
                <p className="text-xl font-semibold font-body">
                  {isCorrect ? (
                    <span className="text-green-600">¡Brainrot Magnifico! 🎉✨</span>
                  ) : (
                    <span className="text-red-600">Oops! The correct answer was: {currentWord.dutch} 🤔</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
