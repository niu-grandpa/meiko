import { CompilerContext } from '@/compiler/types'
import { isEqCSH, isEqLSCB, isEqSTN, isEqSpace } from '@/helper/equal'
import getInterpHash from '@/helper/hash'
import domIdDepMap from '@/reactivity/dep'
import {
  CLOSING_SLASH,
  END_TAG,
  ESCAPE_HTML,
  START_TAG,
  WHITE_SPACE
} from '@/shared/const'
import getInterpTag from '@/shared/customTag'
import { escapeHtml } from '@/shared/escapeHtml'
import parseInterpExpr from './parseInterp'
import parseTagName from './parseTag'

export function parseHtml(context: CompilerContext) {
  const { source, stack, result } = context

  const addTagStack = (s: string) => stack.push(s)
  const addHtmlToken = (...items: string[]) => result.push(...items)

  let i = 0
  while (i < source.length) {
    // 匹配到开始标签 <div> | </div>
    if (isEqSTN(source.charAt(i))) {
      let j = i + 1 // -> div> | -> /div>
      // 假如写成这样 < div>
      if (isEqSpace(source.charAt(j))) {
        addHtmlToken(ESCAPE_HTML.lt)
        continue
      }
      addHtmlToken(START_TAG)
      // 匹配到结束斜杠标签
      if (isEqCSH(source.charAt(j))) {
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
        const { jump, stopped, name, invalid } = parseTagName(j, source)
        i += jump
        addHtmlToken(name)
        // <....<
        // ↑    ↑ 匹配无效
        if (!invalid) {
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
    }
    // 预判下一个为 '{' ，因此 '{{' 成立
    else if (isEqLSCB(source.charAt(i)) && isEqLSCB(source.charAt(i + 1))) {
      const { jump, name, temp, invalid } = parseInterpExpr((i += 2), context)
      i += jump
      // 说明匹配到了结束标签 '>'，而不是 '}}'
      if (invalid) {
        addHtmlToken(...temp)
      } else {
        const hash = getInterpHash(name)
        result.push(...getInterpTag(hash))
        domIdDepMap.add(name, hash)
      }
    } else {
      const string = escapeHtml(source.charAt(i++))
      addHtmlToken(string)
    }
  }
}
