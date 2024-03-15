import { ExtractScriptResult } from '../shared'
import { CompilerContext } from './compilerContext'

export interface CompileResult {
  html: string
  filepath: string
  runtime: CompilerContext['runtime']
  internalScript: ExtractScriptResult['internalScript']
}
