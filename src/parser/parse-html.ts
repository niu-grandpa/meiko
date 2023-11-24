import { CompilerContext } from '@/compiler/types'
import { CLOSING_SLASH, END_TAG, START_TAG, WHITE_SPACE } from '@/const'
import handleInterpExpr from '@/core/handle-interp'
import {
  isEqCSH,
  isEqLSCB,
  isEqSTN,
  isEqSpace,
  parseInterpExpr,
  parseTagName
} from '.'

export function parseHtml(context: CompilerContext) {
  const { source, stack, result } = context

  const addTagStack = (s: string) => stack.push(s)
  const addHtmlToken = (...items: string[]) => result.push(...items)

  let i = 0
  while (i < source.length) {
    // 匹配到开始标签 <div> | </div>
    if (isEqSTN(source[i])) {
      addHtmlToken(START_TAG)
      let j = i + 1 // -> div> | -> /div>
      // 假如写成这样 < div>
      if (isEqSpace(source[j])) {
        throw SyntaxError(
          `html tag names cannot have leading spaces < element>`
        )
      }
      // 匹配到结束斜杠标签
      if (isEqCSH(source[j])) {
        addHtmlToken(CLOSING_SLASH)
        const sTN = stack.pop()
        const { jump, name: eTN } = parseTagName(j + 1, source, true)
        // 校验开始和结束标签名的一致性
        if (sTN !== eTN) {
          throw SyntaxError(`invalid html tag -> <${sTN}></${eTN}>`)
        }
        i += jump
        addHtmlToken(eTN, END_TAG)
      } else {
        const { jump, stopped, name } = parseTagName(j, source)
        i += jump
        addHtmlToken(name)
        // 遇到空格结束标签匹配，可能空格后面有元素属性什么的 <div key="value" ...>
        //                                                   ↑↑ 匹配到空格
        if (stopped) {
          addHtmlToken(WHITE_SPACE)
          // todo 解析属性 添加属性
        }
        addHtmlToken(END_TAG)
        addTagStack(name)
      }
    }
    // 预判下一个为 '{' ，因此 '{{' 成立
    else if (isEqLSCB(source[i]) && isEqLSCB(source[i + 1])) {
      const { jump, name, temp } = parseInterpExpr((i += 2), context)
      i += jump
      // 说明匹配到了结束标签 '>'，而不是 '}}'
      if (temp.length) {
        addHtmlToken(...temp)
      } else {
        handleInterpExpr(name, context)
      }
    } else {
      addHtmlToken(source[i++])
    }
  }
}
