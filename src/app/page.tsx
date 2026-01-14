'use client'

import { useGameStore } from '@/store/useGameStore'
import StartScreen from '@/components/StartScreen/StartScreen'
import GameScreen from '@/components/Game/GameScreen'

export default function Page() {
  const screen = useGameStore((s) => s.screen)

  return screen === 'start'
    ? <StartScreen />
    : <GameScreen />
}
