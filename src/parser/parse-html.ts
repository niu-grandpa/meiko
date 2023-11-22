import { CompilerContext } from '@/compiler/context'
import { CLOSING_SLASH, END_TAG, START_TAG, WHITE_SPACE } from '@/const'
import {
  isEqCSH,
  isEqLSCB,
  isEqSTN,
  isEqSpace,
  parseInterpExpr,
  parseTagName
} from '.'

export function parseHtml(context: CompilerContext) {
  const { source, stack, result, createInterpTag } = context

  const addTagStack = (s: string) => stack.push(s)
  const addToken = (...items: string[]) => result.push(...items)

  let i = 0
  // <div>1  2</div>
  while (i < source.length) {
    // 匹配到开始标签 <div> | </div>
    if (isEqSTN(source[i])) {
      addToken(START_TAG)
      let j = i + 1 // -> div> | -> /div>
      // 假如写成这样 < div> | <  div>
      while (isEqSpace(source[j])) {
        j++
        console.warn(`html tag names cannot have leading spaces < element>`)
      }
      // 匹配到结束斜杠标签
      if (isEqCSH(source[j])) {
        addToken(CLOSING_SLASH)
        const sTN = stack.pop()
        const { jump, name: eTN } = parseTagName(j, source, END_TAG)
        // 校验开始和结束标签名的一致性
        if (sTN !== eTN) {
          throw SyntaxError(`invalid html tag -> <${sTN}></${eTN}>`)
        }
        i += jump
        addToken(eTN, END_TAG)
      } else {
        const { jump, stopped, name } = parseTagName(j, source, END_TAG)
        i += jump
        addToken(name)
        // 遇到空格结束标签匹配，可能空格后面有元素属性什么的 <div key="value" ...>
        //                                                   ↑↑ 匹配到空格
        if (stopped) {
          addToken(WHITE_SPACE)
          // todo 解析属性 添加属性
        }
        addToken(END_TAG)
        addTagStack(name)
      }
    }
    // 预判下一个为 '{' ，因此 '{{' 成立
    else if (isEqLSCB(source[i]) && isEqLSCB(source[i + 1])) {
      const { jump, name, temp } = parseInterpExpr(i, context)
      // 说明匹配到了结束标签 '>'，而不是 '}}'
      if (temp.length) {
        i++
        addToken(...temp)
      } else {
        i += jump
        // createInterpTag()
      }
    } else {
      addToken(source[i++])
    }
  }
}
