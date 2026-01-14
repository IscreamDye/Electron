export type PrimitiveAction =
  | 'forward'
  | 'left'
  | 'right'
  | 'pickup'
  | 'putdown'

export type Condition =
  | 'onData'
  | 'onEmpty'
  | 'carrying'
