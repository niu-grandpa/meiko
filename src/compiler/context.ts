import {
  CLOSING_SLASH,
  END_TAG,
  INTERP_HTML_TAGNAME,
  START_TAG,
  WHITE_SPACE
} from '@/const'

export type CompilerContext = {
  stack: string[]
  result: string[]
  source: string
  createInterpTag: (domId: string) => string
}

export function contextCreator(): CompilerContext {
  return {
    stack: [],
    result: [],
    source: '',
    createInterpTag: (domId: string) => {
      const attr = `id="${domId}"`
      const start = [START_TAG, INTERP_HTML_TAGNAME, WHITE_SPACE, attr, END_TAG]
      const end = [START_TAG, CLOSING_SLASH, INTERP_HTML_TAGNAME, END_TAG]
      return start.concat(end).join('')
    }
  }
}
