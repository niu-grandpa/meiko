import { isProxyKey } from '@/shared/const'
import { ProxyContext, proxyGetter, proxySetter } from './proxyHandler'

const proxyMap = new WeakMap()

export function createModel<T extends object>(name: string, data: () => T): T {
  const context: ProxyContext = Object.create(null)
  context.accessKey = name + '.'
  return createProxy(data(), name, context)
}

export function createProxy<T extends object>(
  target: T,
  modelName: string,
  context?: ProxyContext
): T {
  if (target.hasOwnProperty(isProxyKey)) {
    return target
  }
  if (!proxyMap.has(target)) {
    const proxyObject = new Proxy(target, createHandler(modelName, context))
    Object.defineProperty(proxyObject, isProxyKey, {
      configurable: true,
      enumerable: false,
      writable: false,
      value: true
    })
    proxyMap.set(target, proxyObject)
  }
  return proxyMap.get(target) as T
}

function createHandler<T extends object>(
  modelName: string,
  context?: ProxyContext
): ProxyHandler<T> {
  const handler: ProxyHandler<T> = {
    get(target, key, receiver) {
      return proxyGetter<T>({ target, key, receiver, modelName: '' })
    },
    set(target, key, newValue, receiver) {
      return proxySetter<T>({
        target,
        key,
        newValue,
        receiver,
        context,
        modelName
      })
    }
  }

  return handler
}
