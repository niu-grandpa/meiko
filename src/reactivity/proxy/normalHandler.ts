import { ProxyContext } from '.'
import { proxyGetter, proxySetter } from './baseHandler'

const normalHandler = <T extends object>(
  modelName: string,
  context: ProxyContext
): ProxyHandler<T> => {
  const common = { context, modelName, handler: normalHandler }
  return {
    get(target, prop, receiver) {
      return proxyGetter<T>({
        target,
        prop,
        receiver,
        ...common
      })
    },
    set(target, prop, newValue, receiver) {
      return proxySetter<T>({
        target,
        prop,
        newValue,
        receiver,
        ...common
      })
    }
  }
}

export default normalHandler
