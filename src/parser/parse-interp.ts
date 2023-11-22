import { CompilerContext } from '@/compiler/context'
import { isEqRSCB, isEqSTN, isEqSpace } from '.'

type ParseInterExprResult = {
  jump: number
  name: string
  temp: string[]
}

export function parseInterpExpr(
  pos: number,
  context: CompilerContext
): ParseInterExprResult {
  const { source } = context
  const data: ParseInterExprResult = {
    jump: 0,
    name: '',
    temp: []
  }

  let j = pos + 2
  let interpName = ''
  let isCancel = false

  // 寻找对应的 '}}' 作为结束条件
  while (!isEqRSCB(source[j]) && !isEqRSCB(source[j + 1])) {
    // 1.未匹配到对应 '}}' ，而是匹配到开始标签 '<' ，此次插值处理作废
    // 2.当匹配到一个 '}' 而下一个非 '}'，则此次处理作废
    if (
      isEqSTN(source[j]) ||
      (isEqRSCB(source[j]) && !isEqRSCB(source[j + 1]))
    ) {
      isCancel = true
      break
    }
    if (source[j] || !isEqSpace(source[j])) {
      interpName += source[j]
    }
    data.temp.push(source[j++])
  }

  if (!isCancel) {
    // 顺利遇到 }}，由于上面结束条件是预判了下一个 }，因此指针从第一个 } 的位置向后跳2
    data.jump = j + 2
    data.name = interpName
    data.temp.length = 0
  }

  return data
}
