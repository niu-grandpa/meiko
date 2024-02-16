import { isEqual } from '@/shared/equal'

type Position = {
  line: number
  column: number
}

type UseRecordCodePos = [Position, (char: string) => void]

/**
 * 该钩子用于匹配代码时，记录token所在的行列数
 * @returns {UseRecordCodePos}
 */
export const useRecordCodePos = (): UseRecordCodePos => {
  const state: Position = {
    line: 1,
    column: 1
  }
  const handler = (char: string) => {
    if (isEqual(char, '\n')) {
      state.line++
      state.column = 1
    } else {
      state.column++
    }
  }
  return [state, handler]
}
