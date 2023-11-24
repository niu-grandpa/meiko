import { isEqETN, isEqSpace } from '.'

type ParseTagNameResult = {
  jump: number
  name: string
  stopped: boolean
}

export function parseTagName(
  pos: number,
  source: string,
  isClosed = false
): ParseTagNameResult {
  const data = { jump: 1, name: '', stopped: false }

  while (!isEqETN(source[pos])) {
    data.jump++
    if (!isEqSpace(source[pos])) {
      data.name += source[pos++]
    } else {
      data.stopped = true
      break
    }
  }
  // 当前指针结束于 '>'，因此还要往前移一位
  // 如果是闭合标签，exp: </div>，则指针会停留在 'v' 的位置，因此需要前移两位
  data.jump += isClosed ? 2 : 1
  return data
}
