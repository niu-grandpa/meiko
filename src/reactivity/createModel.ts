import { isFunction } from '@/helper/equal'
import { createProxy, ProxyContext } from './proxy'
import normalHandler from './proxy/normalHandler'

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
export function createModel<T extends object>(name: string, state: () => T): T
export function createModel(name: string, state: () => object) {
  if (!isFunction(state)) {
    console.warn(`[Meiko warn]: model cannot be created: ${String(state)}`)
    return state
  }
  const target = state()
  const context: ProxyContext = {
    accessKey: name + '.',
    isReadOnly: false,
    isReactive: true,
    isDeep: true
  }
  return createProxy(target, context, normalHandler(name, context))
}
