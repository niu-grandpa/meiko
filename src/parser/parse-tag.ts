import { ESCAPE_HTML } from '@/const'
import { isEqETN, isEqSTN, isEqSpace } from '@/helper/equal'

type ParseTagNameResult = {
  jump: number
  name: string
  stopped: boolean
  invalid: boolean
}

export default function parseTagName(
  pos: number,
  source: string,
  isClosed = false
): ParseTagNameResult {
  const data: ParseTagNameResult = {
    jump: 1,
    name: '',
    stopped: false,
    invalid: false
  }

  while (!isEqETN(source.charAt(pos))) {
    data.jump++
    const ch = source.charAt(pos)
    if (isEqSTN(ch)) {
      data.invalid = true
      data.name += ESCAPE_HTML.gt
      break
    }
    if (isEqSpace(ch)) {
      data.stopped = true
      break
    }
    data.name += source.charAt(pos++)
  }
  // 当前指针结束于 '>'，因此还要往前移一位
  // 如果是闭合标签，exp: </div>，则指针会停留在 'v' 的位置，因此需要前移两位
  data.jump += isClosed ? 2 : 1
  return data
}
