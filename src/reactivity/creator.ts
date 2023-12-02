import { isReactive } from '@/helper/equal'
import { ReactiveFlags } from '@/shared/const'
import { ProxyContext, proxyGetter, proxySetter } from './proxyHandler'

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

const proxyMap = new WeakMap()

export function createModel<T extends object>(name: string, data: () => T): T {
  const context: ProxyContext = Object.create(null)
  context.accessKey = name + '.'
  return createProxy(data(), name, context)
}

export function createProxy<T extends object>(
  target: T,
  modelName: string,
  context: ProxyContext
): T {
  if (isReactive(target)) {
    return target
  }
  if (!proxyMap.has(target)) {
    const reactiveObject = new Proxy(target, createHandler(modelName, context))
    markTargetType(reactiveObject, ReactiveFlags.IS_REACTIVE, true)
    proxyMap.set(target, reactiveObject)
  }
  return proxyMap.get(target) as T
}

function createHandler<T extends object>(
  modelName: string,
  context: ProxyContext
): ProxyHandler<T> {
  const base = { context, modelName }

  const handler: ProxyHandler<T> = {
    get(target, key, receiver) {
      return proxyGetter<T>({ target, key, receiver, ...base })
    },
    set(target, key, newValue, receiver) {
      return proxySetter<T>({
        target,
        key,
        newValue,
        receiver,
        ...base
      })
    }
  }

  return handler
}

function markTargetType(target: object, type: ReactiveFlags, flag: boolean) {
  Object.defineProperty(target, type, {
    value: flag,
    writable: false,
    configurable: false
  })
}
