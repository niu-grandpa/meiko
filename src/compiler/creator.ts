import { parseHtml } from '@/parser'
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
