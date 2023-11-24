import { createInterpTag } from '@/compiler'
import { getInterpHash } from '@/compiler/creator'
import { CompilerContext } from '@/compiler/types'

export default function handleInterpExpr(
  name: string,
  context: CompilerContext
) {
  const hash = getInterpHash(name)
  context.result.push(...createInterpTag(hash))
  // todo 响应式数据关联收集哈希
}
