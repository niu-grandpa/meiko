import { INTERP_HTML_TAGNAME } from '@/constant/tagName'
import {
  isBool,
  isEqETN,
  isEqLSCB,
  isEqRSCB,
  isEqSTN,
  isEqSpace,
  isNull,
  isUndef
} from '@/shared/equal'
import createHashByString from '@/shared/hash'
import {
  isEmptyString,
  isQuotedString,
  isVariableName,
  stringToFunction
} from '@/shared/string'

interface ReturnValue {
  jump: number
  tokens: string[]
  errMsg: string
}

export default function parseInterpolation(
  pos: number,
  source: string,
  onRecordPos?: (token: string) => void
): ReturnValue {
  const createCustomTag = (id: string): string => {
    return `<${INTERP_HTML_TAGNAME} id="${id}"></${INTERP_HTML_TAGNAME}>`
  }
  const data: ReturnValue = {
    jump: 0,
    tokens: [],
    errMsg: ''
  }
  // 如果 '{{' 之后再匹配到 '{'，这是错误的
  if (isEqLSCB(source[pos])) {
    data.errMsg = 'Interpolation syntax error: {{{...'
    return data
  }

  let idx = pos
  let token = ''
  let nextToken = ''

  while (true) {
    token = source[idx]
    nextToken = source[idx + 1]
    onRecordPos?.(token)
    data.jump++
    // 匹配到 '}'
    if (isEqRSCB(token)) {
      onRecordPos?.(nextToken)
      // }[}]
      if (isEqRSCB(nextToken)) {
        idx++
        data.jump++
        break
      }
      // }[>] | }[<]
      if (
        isEqSTN(nextToken) ||
        isEqETN(nextToken) ||
        idx >= source.length - 1
      ) {
        data.errMsg = `
        Interpolation end sign was not found: {{${source.substring(
          pos,
          idx
        )}${nextToken}`
        return data
      }
    }
    idx++
  }
  // 解构插值内容
  const value = source.substring(pos, idx - 1).trim()
  let tokens = value.split('')
  // 纯字符串
  if (isEmptyString(value) || isQuotedString(value)) {
    // 去除前后空格
    isEqSpace(tokens[0]) && tokens.shift()
    isEqSpace(tokens[tokens.length - 1]) && tokens.pop()
    // 去除前后引号
    tokens.shift()
    tokens.pop()
  } else {
    if (isVariableName(value)) {
      const id = createHashByString(value)
      // TODO runtime
      tokens = [...createCustomTag(id)]
    } else {
      // 硬编码的原始值
      const rawValue = stringToFunction(value).call(undefined)
      if (isBool(rawValue) || isUndef(rawValue) || isNull(rawValue)) {
        tokens.length = 0
      } else {
        tokens = [...String(rawValue)]
      }
    }
  }

  data.tokens = tokens
  return data
}
