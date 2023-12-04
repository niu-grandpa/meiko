import { isReadonly } from '.'
import { ProxyContext, createProxy } from './proxy'

/**
 *
 * @param name
 * @param data
 *
 * ```js
 * const state = createModel('state', () => {
 *   const count = 0
 *   return { count }
 * })
 *
 * state.count++
 * state.count // -> 1
 * ```
 */
export function createModel<T extends object>(name: string, data: () => T): T
export function createModel(name: string, data: () => object) {
  const target = data()
  // if target is a readonly proxy, it will be returned directly without observation.
  if (isReadonly(target)) {
    return target
  }
  const context: ProxyContext = {
    accessKey: name + '.',
    isReadOnly: false,
    isReactive: true,
    isDeep: true
  }
  return createProxy(target, name, context)
}
