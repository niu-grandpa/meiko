import {
  CLOSING_SLASH,
  END_TAG,
  LF_SCB,
  RT_SCB,
  START_TAG,
  WHITE_SPACE
} from '@/const'

export const isEqSTN = (value: string) => value === START_TAG
export const isEqETN = (value: string) => value === END_TAG
export const isEqCSH = (value: string) => value === CLOSING_SLASH
export const isEqLSCB = (value: string) => value === LF_SCB
export const isEqRSCB = (value: string) => value === RT_SCB
export const isEqSpace = (value: string) => value === WHITE_SPACE
