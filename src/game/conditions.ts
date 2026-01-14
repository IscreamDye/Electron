// src/game/conditions.ts

export type Condition =
  | 'onData'
  | 'onEmpty'
  | 'carrying'
  | 'onCorner'
  | 'onCornerUp'
  | 'onCornerDown'
  | 'onCornerLeft'
  | 'onCornerRight'

export interface PlayerState {
  x: number
  y: number
  carrying: boolean
}

export interface Level {
  layout: string[]
}

/**
 * Pure condition evaluator.
 * No side effects.
 * No mutation.
 * Always safe.
 */
export function checkCondition(
  condition: Condition | Condition[],
  level: Level,
  player: PlayerState
): boolean {
  // Support AND of multiple conditions
  if (Array.isArray(condition)) {
    return condition.every((c) => checkCondition(c, level, player))
  }

  const tile = level.layout[player.y]?.[player.x] ?? null

  switch (condition) {
    case 'onData':
      return tile === '8'

    case 'onEmpty':
      return tile === '9'

    case 'carrying':
      return player.carrying

    case 'onCorner':
      return tile === '2' || tile === '3' || tile === '4' || tile === '5'

    case 'onCornerUp':
      return tile === '3'

    case 'onCornerDown':
      return tile === '5'

    case 'onCornerLeft':
      return tile === '4'

    case 'onCornerRight':
      return tile === '2'

    default:
      return false
  }
}
