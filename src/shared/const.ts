export const START_TAG = '<'

export const END_TAG = '>'

export const WHITE_SPACE = ' '

export const CLOSING_SLASH = '/'

/**S 表示 Single, CB 表示 CURLY_BRACES */
export const LF_SCB = '{'

/**S 表示 Single, CB 表示 CURLY_BRACES */
export const RT_SCB = '}'

/**D 表示 Double, CB 表示 CURLY_BRACES */
export const LF_DCB = '{{'

/**D 表示 Double, CB 表示 CURLY_BRACES */
export const RT_DCB = '}}'

/**插值表达式钦定的标签名 */
export const INTERP_HTML_TAGNAME = 'meiko-value'

export const enum ESCAPE_HTML {
  lt = '&lt;', // <
  gt = '&gt;', // >
  apo = '&#39;', // '
  amp = '&amp;', // &
  quot = '&quot;' // "
}

export const enum ReactiveFlags {
  SKIP = '__m_skip',
  IS_REACTIVE = '__m_isReactive',
  IS_READONLY = '__m_isReadonly',
  IS_SHALLOW = '__m_isShallow',
  RAW = '__m_raw'
}
