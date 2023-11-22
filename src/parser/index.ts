import { CLOSING_SLASH, LF_SCB, RT_SCB, START_TAG, WHITE_SPACE } from '@/const'

export const isEqSTN = (value: string) => value === START_TAG
export const isEqCSH = (value: string) => value === CLOSING_SLASH
export const isEqLSCB = (value: string) => value === LF_SCB
export const isEqRSCB = (value: string) => value === RT_SCB
export const isEqSpace = (value: string) => value === WHITE_SPACE

export { parseHtml } from './parse-html'
export { parseInterpExpr } from './parse-interp'
export { parseTagName } from './parse-tag'
