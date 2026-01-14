export type CellType = string // flexible: '0' empty, '7' start, '8' data(source), '9' empty target, 'A'..'Z' teleports

export type Direction = 'up' | 'right' | 'down' | 'left'

export type Action =
  | 'forward'
  | 'left'
  | 'right'
  | 'pickup'
  | 'putdown'

export interface Level {
  name: string
  allowedActionsCount: number
  maxActions: number
  // number of data items that must be placed to win (optional). If omitted, defaults to number of data sources ('8').
  maxData?: number
  layout: string[]
}

export interface PlayerState {
  x: number
  y: number
  direction: Direction
  carryingData: boolean
}  
