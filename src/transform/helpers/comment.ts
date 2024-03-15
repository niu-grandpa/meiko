import { COMMENT_END, COMMENT_START, END_TAG } from '@/constant/htmlToken'
import { isEqSpace, isEqual } from '@/shared/equal'

const findCommentToken = (
  pos: number,
  source: string,
  findEnd: boolean,
  onRecordPos?: (token: string) => void
) => {
  const result = {
    jump: 0,
    errMsg: ''
  }
  const target = findEnd ? COMMENT_END : COMMENT_START
  let string = findEnd ? '' : '<!'
  let token = ''
  while (!isEqual(string.length, target.length)) {
    token = source[pos++]
    onRecordPos?.(token)
    if (!findEnd && (!token || isEqSpace(token))) {
      result.errMsg = 'Incorrectly opened comment.'
      return result
    }
    if (pos >= source.length - 1 && !isEqual(source[pos], END_TAG)) {
      result.errMsg = 'Unexpected EOF in comment.'
      return result
    }
    string += token
  }
  result.jump = isEqual(string, target) ? pos : -1
  return result
}

export const parseComment = {
  findStart: (
    pos: number,
    source: string,
    onRecordPos?: (token: string) => void
  ) => {
    return findCommentToken(pos, source, false, onRecordPos)
  },
  findEnd: (
    pos: number,
    source: string,
    onRecordPos?: (token: string) => void
  ) => {
    return findCommentToken(pos, source, true, onRecordPos)
  }
}
