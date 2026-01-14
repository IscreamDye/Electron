// src/game/engine.ts

import { checkCondition, Condition } from './conditions'

export type Direction = 'up' | 'right' | 'down' | 'left'

export type PrimitiveAction =
  | 'forward'
  | 'left'
  | 'right'
  | 'pickup'
  | 'putdown'

export type ProgramNode =
  | { type: 'action'; action: PrimitiveAction }
  | { type: 'loop' }
  | { type: 'if'; condition: Condition | Condition[]; then: ProgramNode }

export interface PlayerState {
  x: number
  y: number
  direction: Direction
  carrying: boolean
}

export interface Teleport {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export interface Level {
  layout: string[]
  teleports?: Teleport[]
} 

export type EngineResult = PlayerState | 'dead' | 'won'

const dirs: Direction[] = ['up', 'right', 'down', 'left']

export function executeProgram(
  level: Level,
  program: ProgramNode[],
  initial: PlayerState,
  maxSteps = 100,
  onTrace?: (msg: string) => void
): EngineResult {
  const trace = (m: string) => { try { console.log('[engine]', m) } catch (e) {} if (onTrace) onTrace(m) }
  // create mutable grid copy and original grid for reference
  const grid = level.layout.map((r) => r.split(''))
  const orig = level.layout.map((r) => r.split(''))
  const required = typeof (level as any).maxData === 'number' ? (level as any).maxData : null
  let placed = 0

  let state: PlayerState = { ...initial }
  let pc = 0
  let steps = 0

  while (pc < program.length) {
    trace(`pc=${pc} steps=${steps}`)
    if (steps++ >= maxSteps) return state

    const node = program[pc]

    if (node.type === 'loop') {
      pc = 0
      continue
    }

    if (node.type === 'if') {
      trace(`if at pc=${pc} condition=${JSON.stringify(node.condition)}`)
      if (checkGridCondition(node.condition, grid, state)) {
        const res = executeProgram(
          level,
          [node.then],
          state,
          maxSteps - steps,
          onTrace
        )
        if (res === 'dead') return res
        if (res === 'won') return 'won'
        state = res as PlayerState
      }
      pc++
      continue
    }

    // snapshot tile before primitive
    const prevTile = grid[state.y]?.[state.x]
    trace(`executePrimitive at pc=${pc} action=${node.action} player=${JSON.stringify(state)} tile=${prevTile}`)
    const res = executePrimitive(level, state, node.action, grid, orig, required)
    if (res === 'dead') {
      trace(`result dead at pc=${pc}`)
      return res
    }
    if (res === 'won') {
      trace(`result won at pc=${pc}`)
      return 'won'
    }

    // primitive executed successfully, update state and advance
    state = res as PlayerState
    pc++
    continue
  }

  // finished program without dying or winning
  return state
}

function checkGridCondition(condition: Condition | Condition[], grid: string[][], player: PlayerState): boolean {
  if (Array.isArray(condition)) {
    return condition.every((c) => checkGridCondition(c, grid, player))
  }

  const tile = grid[player.y]?.[player.x] ?? null
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

function countInitialData(grid: string[][]) {
  let n = 0
  for (const r of grid) for (const c of r) if (c === '8') n++
  return n
} 

function executePrimitive(
  level: Level,
  state: PlayerState,
  action: PrimitiveAction,
  grid: string[][],
  orig: string[][],
  required: number
): EngineResult {
  const next: PlayerState = { ...state }

  if (action === 'left') {
    next.direction = dirs[(dirs.indexOf(next.direction) + 3) % 4]
    return next
  }

  if (action === 'right') {
    next.direction = dirs[(dirs.indexOf(next.direction) + 1) % 4]
    return next
  }

  if (action === 'forward') {
    if (next.direction === 'up') next.y--
    if (next.direction === 'down') next.y++
    if (next.direction === 'left') next.x--
    if (next.direction === 'right') next.x++

    let tile = grid[next.y]?.[next.x]

    // valid walkable tiles: lane '1', start 'S', data 'D', empty 'E', teleport 'T'
    if (!tile || tile === '0') return 'dead'

    // explicit teleport mapping (Option B): if stepping on a 'T' tile, look up mapping
    if (tile === 'T' && level.teleports) {
      const map = level.teleports.find((m) => m.from.x === next.x && m.from.y === next.y)
      if (map) {
        next.x = map.to.x
        next.y = map.to.y
        // don't attempt to chain-teleport here; one teleport per move
      }
    }

    return next
  }

  if (action === 'pickup') {
    const tile = grid[state.y]?.[state.x]
    if (tile === '8' && !state.carrying) {
      next.carrying = true
      // remove source so it cannot be picked again
      // mark as extracted-empty so it doesn't act as a putdown target
      grid[state.y][state.x] = 'e'
    }
    return next
  }

  if (action === 'putdown') {
    const tile = grid[state.y]?.[state.x]
    if (tile === '9' && state.carrying) {
      // place data on the target
      grid[state.y][state.x] = '8'

      // count placed D's on original E cells
      let placed = 0
      for (let yy = 0; yy < grid.length; yy++) {
        for (let xx = 0; xx < grid[yy].length; xx++) {
          if (orig[yy]?.[xx] === '9' && grid[yy][xx] === '8') placed++
        }
      }

      if (placed >= required) return 'won'

      const res: PlayerState = { ...next, carrying: false }
      return res
    }
    return next
  }

  return next
}
