import { parseHtml } from '@/parser'
import checkSize from './sizeCheck'
import { Compiler, CompilerContext } from './types'

export function createCompiler(): Compiler {
  const context = createContext()
  const compilerFn = (html: string): CompilerContext => {
    context.source = html.trim()
    parseHtml(context)
    context.size = checkSize(context.result)
    return context
  }
  return compilerFn
}

export function createContext(): CompilerContext {
  return {
    stack: [],
    result: [],
    source: '',
    size: '0'
  }
}
