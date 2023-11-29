import { CompilerContext } from '@/compiler/types'
import { isEqRSCB, isEqSTN, isEqSpace } from '@/helper/equal'

type ParseInterExprResult = {
  jump: number
  name: string
  invalid: boolean
  temp: string[]
}

export default function parseInterpExpr(
  pos: number,
  context: CompilerContext
): ParseInterExprResult {
  const { source } = context
  const data: ParseInterExprResult = {
    jump: 1,
    name: '',
    invalid: false,
    temp: []
  }

  let interpName = ''

  while (true) {
    data.jump++
    const ch = source.charAt(pos)
    const next = source.charAt(pos + 1)
    // 寻找对应的 '}}' 作为结束条件
    if (isEqRSCB(ch) && isEqRSCB(next)) {
      break
    }
    // 1.未匹配到对应 '}}' ，而是匹配到开始标签 '<' ，此次插值处理作废
    // 2.当匹配到一个 '}' 而下一个非 '}'，则此次处理作废
    // invalid: <div>{{xx}</div> or <div>{{xx</div>
    if (isEqSTN(ch) || (isEqRSCB(ch) && !isEqRSCB(next))) {
      data.invalid = true
      break
    }
    if (ch || !isEqSpace(ch)) {
      interpName += ch
    }
    data.temp.push(source.charAt(pos++))
  }

  if (!data.invalid) {
    // 顺利遇到 }}，由于上面结束条件是预判了下一个 }，因此指针从第一个 } 的位置向后跳2
    data.name = interpName
    data.temp.length = 0
  }

  return data
}
