import { transform } from '@/transform'
import { extractScriptContent } from './shared'
import { CompileResult } from './types/compileResult'
import { CompilerContext } from './types/compilerContext'

export type Compiler = (html: string) => CompileResult

export function compileCreator(): Compiler {
  const createRtObj = (): CompilerContext['runtime'] => ({ domEvent: [] })

  const createContext = (): CompilerContext => ({
    stack: [],
    tokens: [],
    source: '',
    runtime: createRtObj()
  })

  return function (html: string) {
    const context = createContext()
    const { cleanedStr, internalScript } = extractScriptContent(html)

    context.source = cleanedStr

    return {
      filepath: '',
      internalScript,
      html: transform(context),
      runtime: context.runtime
    }
  }
}
