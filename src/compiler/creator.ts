import {
  CLOSING_SLASH,
  END_TAG,
  INTERP_HTML_TAGNAME,
  START_TAG,
  WHITE_SPACE
} from '@/const'
import { parseHtml } from '@/parser'
import crypto from 'crypto'
import { Compiler, CompilerContext } from './types'

export function createCompiler(): Compiler {
  const context = createContext()
  const compilerFn = (html: string): CompilerContext => {
    context.source = html.trim()
    parseHtml(context)
    return context
  }
  return compilerFn
}

export function createContext(): CompilerContext {
  return {
    stack: [],
    result: [],
    source: ''
  }
}

export function createInterpTag(hash: string) {
  const attr = `id="${hash}"`
  const start = [START_TAG, INTERP_HTML_TAGNAME, WHITE_SPACE, attr, END_TAG]
  const end = [START_TAG, CLOSING_SLASH, INTERP_HTML_TAGNAME, END_TAG]
  return start.concat(end)
}

function createInterpHash() {
  let id = 1
  const set = new Set<string>()

  const computeHash = (value: string): string => {
    const md5Hash = crypto.createHash('md5').update(value).digest('hex')
    const firstFour = md5Hash.slice(0, 4)
    const middleThree = md5Hash.slice(
      ~~(md5Hash.length / 2) - 1,
      ~~(md5Hash.length / 2) + 2
    )
    const lastThree = md5Hash.slice(md5Hash.length - 3)
    return firstFour + middleThree + lastThree
  }

  const creator = (name: string) => {
    let _name = name
    if (set.has(_name)) {
      _name = `${name}_${id++}`
    }
    set.add(_name)
    return computeHash(_name)
  }

  return creator
}

export const getInterpHash = createInterpHash()
