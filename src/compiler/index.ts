import { parseHtml } from '@/parser'
import { CompilerContext, contextCreator } from './context'

type Compiler = (html: string) => CompilerContext

export default function compilerCreator(): Compiler {
  const context = contextCreator()

  const compilerFn = (html: string): CompilerContext => {
    context.source = html.trim()
    parseHtml(context)
    return context
  }

  return compilerFn
}
