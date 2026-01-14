// src/game/runProgram.ts

import { Level } from './types'
import { ProgramNode, PlayerState } from './engine'
import { checkCondition } from './conditions'

const STEP_DELAY = 500

export async function runProgram({
  level,
  program,
  player,
  onStep,
  onDead,
  onWin,
  onGridChange,
  onInstruction,
  speed = 1,
  shouldContinue,
  onTrace,
}: {
  level: Level
  program: ProgramNode[]
  player: PlayerState
  onStep: (p: PlayerState) => void
  onDead: () => void
  onWin: () => void
  onGridChange?: (g: string[][]) => void
  onInstruction?: (idx: number | null) => void
  speed?: number
  // optional: called to verify the run should continue (return false to abort)
  shouldContinue?: () => boolean
  // optional: receive diagnostic trace messages
  onTrace?: (msg: string) => void
}) {
  // normalize speed
  const trace = (m: string) => {
    // console + optional callback
    try { console.log('[runProgram]', m) } catch (e) {}
    if (onTrace) onTrace(m)
  }

  const tickSpeed = Math.max(1, Math.floor(speed))
  let state = { ...player }
  let pc = 0
  let safety = 0
  let stepCount = 0

  // mutable grid copy for runtime changes
  const grid = level.layout.map((r) => r.split(''))
  const required = typeof (level as any).maxData === 'number' ? (level as any).maxData : null
  let placed = 0

  const hasLoop = program.some((n) => n.type === 'loop')
  // keep original program indices so UI can map back to slots
  const instructions = program.map((n, i) => ({ node: n, idx: i })).filter((p) => p.node.type !== 'loop')

  trace(`start level=${(level as any).name ?? 'unknown'} instructions=${instructions.length} hasLoop=${hasLoop}`)

  while (pc < instructions.length) {
    if (safety++ > 10000) {
      trace(`safety limit reached: ${safety}, aborting run`)
      if (onInstruction) onInstruction(null)
      return
    }

    // abort early if requested
    if (shouldContinue && !shouldContinue()) {
      trace(`aborted before step pc=${pc}`)
      if (onInstruction) onInstruction(null)
      return
    }

    const { node, idx } = instructions[pc]

    // notify UI which instruction index is executing and trace
    if (onInstruction) onInstruction(idx)
    trace(`step ${stepCount} pc=${pc} idx=${idx} node=${JSON.stringify(node)}`)

    // snapshot tile at player position before executing the step
    const prevTile = grid[state.y]?.[state.x]

    // diagnostic for forward moves: compute target tile to explain deaths
    if (node.type === 'action' && node.action === 'forward') {
      const nextPos = move(state.x, state.y, state.direction)
      const targetTile = grid[nextPos.y]?.[nextPos.x] ?? null
      trace(`attempting forward to x=${nextPos.x} y=${nextPos.y} tile=${targetTile}`)
    }

    const result = execute(level, state, node, grid)

    if (result === 'dead') {
      // Try to infer reason for death
      let reason = 'unknown'
      if (node.type === 'action' && node.action === 'forward') {
        const nextPos = move(state.x, state.y, state.direction)
        const targetTile = grid[nextPos.y]?.[nextPos.x] ?? null
        if (!targetTile || targetTile === '0') reason = `moved into void at x=${nextPos.x} y=${nextPos.y}`
        else reason = `non-walkable tile '${targetTile}' at x=${nextPos.x} y=${nextPos.y}`
      }

      trace(`result: dead at step ${stepCount} pc=${pc} (${reason})`)

      // clear executing index before notifying
      if (onInstruction) onInstruction(null)
      onDead()
      return
    }

    // if result is an object with updated state
    if (typeof result === 'object') {
      state = result
      trace(`state updated: x=${state.x} y=${state.y} dir=${state.direction} carrying=${state.carrying}`)
      onStep({ ...state })
    }

    // detect if a putdown happened: prevTile was '9' and now contains '8'
    const newTile = grid[state.y]?.[state.x]
    if (prevTile === '9' && newTile === '8') {
      placed++
      trace(`putdown detected: placed=${placed} required=${required}`)
      // check victory if level specifies required placements
      if (required !== null && placed >= required) {
        trace(`won after step ${stepCount} pc=${pc}`)
        if (onInstruction) onInstruction(null)
        onWin()
        return
      }
    }

    // notify grid changes to UI if provided
    if (onGridChange) onGridChange(grid.map((r) => r.slice()))

    await delay(Math.max(20, Math.floor(STEP_DELAY / tickSpeed)))

    // check again after delay to allow immediate stop while waiting
    if (shouldContinue && !shouldContinue()) {
      trace(`aborted after step ${stepCount} pc=${pc}`)
      if (onInstruction) onInstruction(null)
      return
    }

    pc++
    stepCount++

    if (pc >= instructions.length && hasLoop) {
      pc = 0
    }
  }

  // finished, clear executing index
  if (onInstruction) onInstruction(null)
  return
}

function countInitialData(grid: string[][]) {
  let n = 0
  for (const r of grid) for (const c of r) if (c === '8') n++
  return n
} 

/* -------------------------------- */
/* INLINE EXECUTION (NO NEW FILES)  */
/* -------------------------------- */

function execute(
  level: Level,
  state: PlayerState,
  node: ProgramNode,
  grid: string[][]
): PlayerState | 'dead' | 'won' {
  let { x, y, direction, carrying } = state

  function gridCondition(condition: any, player: PlayerState): boolean {
    if (Array.isArray(condition)) return condition.every((c) => gridCondition(c, player))
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

  // IF node: evaluate condition and execute the 'then' branch when true
  if (node.type === 'if') {
    if (gridCondition(node.condition as any, state)) {
      const res = execute(level, state, node.then, grid)
      if (res === 'dead') return res
      return res
    }
    return state
  }

  // Non-action nodes are no-ops here (loops are handled by the outer loop)
  if (node.type !== 'action') return state

  if (node.action === 'left') direction = turnLeft(direction)
  if (node.action === 'right') direction = turnRight(direction)

  if (node.action === 'forward') {
    const next = move(x, y, direction)
    const tile = grid[next.y]?.[next.x]
    if (!tile || tile === '0') return 'dead'
    x = next.x
    y = next.y

    // alphabet teleports: A -> B, B -> C, ... (simple mapping)
    if (tile >= 'A' && tile <= 'Z') {
      const dest = String.fromCharCode(tile.charCodeAt(0) + 1)
      // find destination tile in grid
      for (let yy = 0; yy < grid.length; yy++) {
        for (let xx = 0; xx < grid[yy].length; xx++) {
          if (grid[yy][xx] === dest) {
            x = xx
            y = yy
            yy = grid.length // break outer loop
            break
          }
        }
      }
    }
  }

  if (node.action === 'pickup') {
    if (grid[y][x] === '8' && !carrying) {
      carrying = true
      // remove source data so it cannot be picked again
      // mark as extracted-empty so it doesn't act as a putdown target
      grid[y][x] = 'e'
    }
  }

  if (node.action === 'putdown') {
    if (grid[y][x] === '9' && carrying) {
      carrying = false
      // place data on the target
      grid[y][x] = '8'

      // count delivered and check goal
      const required = typeof (level as any).maxData === 'number' ? (level as any).maxData : countInitialData(level.layout.map((r) => r.split('')))
      // Instead, count placed '8's on cells that were originally '9'
      let placed = 0
      const orig = level.layout.map((r) => r.split(''))
      for (let yy = 0; yy < grid.length; yy++) {
        for (let xx = 0; xx < grid[yy].length; xx++) {
          if (orig[yy]?.[xx] === '9' && grid[yy][xx] === '8') placed++
        }
      }

      if (placed >= required) return 'won'
    }
  }

  return { x, y, direction, carrying }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function move(x: number, y: number, d: PlayerState['direction']) {
  if (d === 'up') return { x, y: y - 1 }
  if (d === 'down') return { x, y: y + 1 }
  if (d === 'left') return { x: x - 1, y }
  return { x: x + 1, y }
}

function turnLeft(d: PlayerState['direction']) {
  return d === 'up' ? 'left' : d === 'left' ? 'down' : d === 'down' ? 'right' : 'up'
}

function turnRight(d: PlayerState['direction']) {
  return d === 'up' ? 'right' : d === 'right' ? 'down' : d === 'down' ? 'left' : 'up'
}
