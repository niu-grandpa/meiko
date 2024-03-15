import { isEqETN, isEqSTN, isEqSpace } from '@/shared/equal'

interface ReturnValue {
  jump: number
  tagName: string
  stopped: boolean
  errMsg: string
}

export default function parseTagName(
  pos: number,
  source: string,
  isClosed = false,
  onRecordPos?: (token: string) => void
): ReturnValue {
  const data: ReturnValue = {
    jump: 0,
    tagName: '',
    stopped: false,
    errMsg: ''
  }

  let idx = pos
  let token = source[idx]

  while (!isEqETN(token)) {
    token = source[idx++]
    onRecordPos?.(token)
    // <div[<] 匹配无效
    if (isEqSTN(token)) {
      data.errMsg = `Unexpected token: '${token}'`
      return data
    }
    // <div[' ']> 遇到空格结束匹配，后面可能存在属性
    if (isEqSpace(token)) {
      if (!isClosed) {
        data.stopped = true
        break
      }
      data.errMsg = `Invalid tag of </${data.tagName}[ ]`
      return data
    }
    data.jump++
  }

  data.tagName = source.substring(pos, idx - 1)
  // idx 现在的位置，例如：<div[>]
  return data
}
