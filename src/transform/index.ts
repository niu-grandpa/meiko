import { OUTPUT_FILE } from '@/compiler'
import { CompilerContext } from '@/compiler/types/compilerContext'
import { CLOSING_SLASH, END_TAG, START_TAG } from '@/constant/htmlToken'
import { useRecordCodePos } from '@/hook/useRecordCodePos'
import {
  isEqCSH,
  isEqETN,
  isEqLSCB,
  isEqSTN,
  isEqSpace,
  isEqual
} from '@/shared/equal'
import { escapeHtml } from '@/shared/escapeHtml'
import makeMapByString from '@/shared/makeMap'
import parseAttribute from './attribute'
import { parseComment } from './helpers/comment'
import parseInterpolation from './interpolation'
import { errorTrace, isTagNameValid } from './shared'
import parseTagName from './tagName'

export function transform(context: CompilerContext): string {
  const { source, stack, tokens } = context
  const [position, recordTokenPos] = useRecordCodePos()
  const htmlSelfClosingTags = makeMapByString(
    'meta,img,br,hr,input,link,area,base,col,embed,param,source,track'
  )

  const add = (pos: number, step: number) => pos + step
  const addTokens = (...items: string[]) => tokens.push(...items)
  const getErrItems = () => ({
    file: OUTPUT_FILE.HTML,
    line: position.line,
    col: position.column
  })

  let outerIdx = 0
  let skipping = false
  let token = source[outerIdx]
  let nextToken = source[outerIdx + 1]

  // 以下使用 '[]' 框起来的表示指针所在的token位置
  while (outerIdx < source.length) {
    recordTokenPos(token)
    if (skipping) {
      const { jump, errMsg } = parseComment.findEnd(
        outerIdx,
        source,
        recordTokenPos
      )
      if (errMsg) {
        errorTrace({
          ...getErrItems(),
          log: errMsg
        })
      }
      if (!isEqual(jump, -1)) {
        outerIdx = jump
        skipping = false
      } else {
        outerIdx = add(outerIdx, 1)
      }
      continue
    }

    token = source[outerIdx]
    nextToken = source[add(outerIdx, 1)]

    let innerIdx = outerIdx
    let nextTokenOfInner = ''
    // 匹配到开始标签。例如：[<]div> | [<]/div>
    if (isEqSTN(token)) {
      innerIdx = add(outerIdx, 1) // 位置步进 <[d]iv>
      nextTokenOfInner = source[innerIdx]
      recordTokenPos(nextTokenOfInner)
      //  <[>]
      if (isEqETN(nextTokenOfInner)) {
        errorTrace({
          ...getErrItems(),
          log: 'Unexpected token: operator [>]'
        })
      }
      //  <[<]
      if (isEqSTN(nextTokenOfInner)) {
        errorTrace({
          ...getErrItems(),
          log: 'Unexpected token: operator [<]'
        })
      }
      // <[' '] | <[' ']div>
      if (isEqSpace(nextTokenOfInner)) {
        errorTrace({
          ...getErrItems(),
          log: "Unexpected token: operator [' ']"
        })
      }
      // <[!]
      if (isEqual(nextTokenOfInner, '!')) {
        const { jump, errMsg } = parseComment.findStart(
          (outerIdx = add(outerIdx, 2)),
          source,
          recordTokenPos
        )
        if (errMsg) {
          errorTrace({
            ...getErrItems(),
            log: errMsg
          })
        }
        if (!isEqual(jump, -1)) {
          skipping = true
          outerIdx = jump
          continue
        }
      }
      // 一切正常，添加开始标签 '<'
      addTokens(START_TAG)
      // 匹配到结束斜杠标签 '/'
      if (isEqCSH(nextTokenOfInner)) {
        // nextTokenOfInner的下个字符
        const nextOneToken = source[innerIdx + 1]
        recordTokenPos(nextOneToken)
        // </[' '] 无效的写法
        if (isEqSpace(nextOneToken)) {
          errorTrace({
            ...getErrItems(),
            log: "Unexpected token: operator [' ']"
          })
        }
        // </[<]
        if (isEqSTN(nextOneToken)) {
          errorTrace({
            ...getErrItems(),
            log: 'Unexpected token: operator [<]'
          })
        }
        // </[>]
        if (isEqETN(nextOneToken)) {
          errorTrace({
            ...getErrItems(),
            log: 'Unexpected token: operator [>]'
          })
        }

        const startTagName = stack.pop()

        if (startTagName && !htmlSelfClosingTags[startTagName]) {
          const { jump, tagName } = parseTagName(
            (outerIdx = add(outerIdx, 2)),
            source,
            true,
            recordTokenPos
          )
          if (!isTagNameValid(tagName)) {
            errorTrace({
              ...getErrItems(),
              log: `Invalid tag name: "${tagName}"`
            })
          }
          if (!isEqual(startTagName, tagName)) {
            errorTrace({
              ...getErrItems(),
              log: `Tag mismatch error: <${startTagName}></${tagName}>`
            })
          }
          outerIdx = add(outerIdx, jump)
          addTokens(CLOSING_SLASH, ...tagName, END_TAG)
        }
        // 如果'<'之后不是字母
      } else if (!isTagNameValid(nextTokenOfInner)) {
        errorTrace({
          ...getErrItems(),
          log: `Illegal tag name. Use '&lt;' to print '<'.`
        })
      } else {
        let currentIsSeflClosing = false

        // 解析开始标签
        const { jump, stopped, errMsg, tagName } = parseTagName(
          (outerIdx = add(outerIdx, 1)),
          source,
          false,
          recordTokenPos
        )
        if (errMsg) {
          errorTrace({
            ...getErrItems(),
            log: errMsg
          })
        }
        if (!isTagNameValid(tagName)) {
          errorTrace({
            ...getErrItems(),
            log: `Invalid tag name: ${tagName}`
          })
        }

        outerIdx = add(outerIdx, jump)
        addTokens(...tagName)
        // 解析属性
        if (stopped) {
          // 因为是在空格处停下来的，所以要前进1位
          const nextIdx = (outerIdx = add(outerIdx, 1))
          if (!isEqETN(source[nextIdx])) {
            const { jump, attrs, seflClosing } = parseAttribute(
              nextIdx,
              context
            )
            outerIdx = add(outerIdx, jump)
            addTokens(...attrs, END_TAG)
            // 处理非原生自闭合标签
            if (seflClosing && !htmlSelfClosingTags[tagName]) {
              const closingTag = `</${tagName}>`
              addTokens(...closingTag)
              currentIsSeflClosing = seflClosing
            }
          } else {
            addTokens(END_TAG)
          }
        } else {
          addTokens(END_TAG)
        }
        if (!currentIsSeflClosing && !htmlSelfClosingTags[tagName]) {
          stack.push(tagName)
        }
      }
    }
    // 解析插值表达式 , get '{{'
    else if (isEqLSCB(token) && isEqLSCB(nextToken)) {
      const { jump, tokens, errMsg } = parseInterpolation(
        (outerIdx = add(outerIdx, 2)),
        source,
        recordTokenPos
      )
      if (errMsg) {
        errorTrace({
          ...getErrItems(),
          log: errMsg
        })
      }
      outerIdx = add(outerIdx, jump)
      addTokens(...tokens)
    } else {
      outerIdx = add(outerIdx, 1)
      addTokens(escapeHtml(token))
    }
  }

  return context.tokens.join('')
}
