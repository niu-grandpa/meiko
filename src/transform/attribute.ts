import { CompilerContext } from '@/compiler/types/compilerContext'
import { WHITE_SPACE } from '@/constant/htmlToken'
import { isEqCSH, isEqETN, isEqSpace } from '@/shared/equal'
import { isQuotedString, normalQuotedString } from '@/shared/string'
import colors from 'picocolors'
import parseEvent from './helpers/event'

interface ReturnValue {
  jump: number
  attrs: string[]
  seflClosing: boolean
}

const quoteTypeRegex = /['"]/

export default function parseAttribute(
  pos: number,
  context: CompilerContext
): ReturnValue {
  const data: ReturnValue = {
    jump: 0,
    attrs: [],
    seflClosing: false
  }
  const { attrs } = data
  const { source, runtime } = context
  const addTokens = (...token: string[]) => attrs.push(...token)

  let string = ''
  let key = ''
  let value = ''
  let next = ''
  let token = source.charAt(pos)

  const restKeyVal = () => (key = value = string = '')

  while (!isEqETN(token)) {
    data.jump++
    token = source[pos]
    next = source[pos + 1]

    // '/>'
    if (isEqCSH(token) && isEqETN(next)) {
      data.jump++
      data.seflClosing = true
      break
    }

    if (!isEqSpace(token)) {
      string += token
    }
    if (string.endsWith('=')) {
      if (quoteTypeRegex.test(next)) {
        key = string.substring(0, string.length - 1)
        string = ''
      }
    } else if (isQuotedString(string)) {
      value = string
      const normalValue = normalQuotedString(value)
      if (key) {
        if (key.startsWith('on')) {
          const { attr, evObj } = parseEvent(key, normalValue)
          addTokens(WHITE_SPACE, ...attr)
          runtime.domEvent.push(evObj)
        } else {
          // TODO 其他自定义属性
          addTokens(WHITE_SPACE, ...key, ...(normalValue ? '=' + value : ''))
        }
      } else {
        addTokens(WHITE_SPACE, ...value)
        console.log(colors.yellow(`Illegal html attributes \`${value}\``))
      }
      restKeyVal()
    } else if (
      isEqETN(next) ||
      // 当匹配到空格时:
      // 1.没有得到key和value两个值，但是string不为空 == 没有value的属性
      // 2.忽略有key且value还在匹配中，但是遇到有空格的情况
      (isEqSpace(next) && string && !key && !quoteTypeRegex.test(string[0]))
    ) {
      addTokens(WHITE_SPACE, ...string)
      restKeyVal()
    }

    pos++
  }

  return data
}
