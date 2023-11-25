import { CompilerContext } from '@/compiler/types'
import createHash from '@/helper/hash'
import getInterpTag from '@/helper/interp-tag'

export default function handleInterpExpr(
  name: string,
  result: CompilerContext['result']
) {
  const hash = createHash(name)
  result.push(...getInterpTag(hash))
  // todo 响应式数据关联收集哈希
}
