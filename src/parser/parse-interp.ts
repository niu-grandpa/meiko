import { CompilerContext } from '@/compiler/types'
import { isEqRSCB, isEqSTN, isEqSpace } from '@/helper/equal'

type ParseInterExprResult = {
  jump: number
  name: string
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
    temp: []
  }

  let interpName = ''
  let invalid = false

  while (true) {
    data.jump++
    // 寻找对应的 '}}' 作为结束条件
    if (isEqRSCB(source[pos]) && isEqRSCB(source[pos + 1])) {
      break
    }
    // 1.未匹配到对应 '}}' ，而是匹配到开始标签 '<' ，此次插值处理作废
    // 2.当匹配到一个 '}' 而下一个非 '}'，则此次处理作废
    // invalid: <div>{{xx}</div> or <div>{{xx</div>
    if (
      isEqSTN(source[pos]) ||
      (isEqRSCB(source[pos]) && !isEqRSCB(source[pos + 1]))
    ) {
      invalid = true
      break
    }
    if (source[pos] || !isEqSpace(source[pos])) {
      interpName += source[pos]
    }
    data.temp.push(source[pos++])
  }

  if (!invalid) {
    // 顺利遇到 }}，由于上面结束条件是预判了下一个 }，因此指针从第一个 } 的位置向后跳2
    data.name = interpName
    data.temp.length = 0
  }

  return data
}
