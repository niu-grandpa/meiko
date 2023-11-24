export type CompilerContext = {
  stack: string[]
  result: string[]
  source: string
}

export type Compiler = (html: string) => CompilerContext

export type HashGenerator = (data: string) => string
