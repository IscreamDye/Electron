import { PrimitiveAction, Condition } from './actions'

export type ProgramNode =
  | {
      type: 'action'
      action: PrimitiveAction
    }
  | {
      type: 'loop'
    }
  | {
      type: 'if'
      condition: Condition
      then: ProgramNode
    }
