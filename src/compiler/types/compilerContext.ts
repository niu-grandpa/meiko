export interface CompilerContext {
  stack: string[]
  tokens: string[]
  source: string
  runtime: {
    domEvent: EventDescriptor[]
  }
}

export interface EventDescriptor {
  id: string
  type: string
  handler: string
}
