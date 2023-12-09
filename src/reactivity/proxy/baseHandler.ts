import { defProp, getRawType } from '@/helper'
import { isEqual, isFunction, isObject } from '@/helper/equal'
import { domDepNotify } from '@/reactivity/notify'
import {
  ProxyContext,
  ProxyGetter,
  ProxyKey,
  ProxySetter,
  createProxy,
  specialType
} from '.'

export const initAccessKey = (context: ProxyContext, str: string) => {
  context.accessKey = `${str}.`
}
export const setAccessKey = (context: ProxyContext, str: ProxyKey) => {
  context.accessKey += `${str.toString()}.`
}

export function proxyGetter<T extends object>(params: ProxyGetter<T>): any
export function proxyGetter(params: ProxyGetter<object>) {
  const { target, prop, receiver, context, modelName, handler } = params

  setAccessKey(context, prop)
  // get Map、Set、WeakMap and other special types of size
  if (prop === 'size' && specialType.includes(getRawType(target))) {
    return Reflect.get(target, prop, target)
  }
  const value = Reflect.get(target, prop, receiver)
  if (isObject(value)) {
    if (context.isDeep) {
      return createProxy(value, context, handler(modelName, context))
    }
    initAccessKey(context, modelName)
    return value
  }
  if (isFunction(value)) {
    initAccessKey(context, modelName)
    return function (...args: unknown[]) {
      return Reflect.apply(value, target, args)
    }
  }

  initAccessKey(context, modelName)
  return value
}

export function proxySetter<T extends object>(params: ProxySetter<T>): boolean
export function proxySetter(params: ProxySetter<object>) {
  const { target, prop, receiver, newValue, context, modelName, handler } =
    params

  setAccessKey(context, prop)

  const { accessKey } = context
  const oldValue = Reflect.get(target, prop, receiver)
  let _newValue = newValue

  if (isObject(oldValue)) {
    if (!context.isDeep) {
      console.warn(
        `[Meiko warn]: without deep observation, sub-objects cannot be set: ${accessKey}`
      )
      return false
    }
    _newValue = createProxy(oldValue, context, handler(modelName, context))
  }

  const _accessKey = accessKey.replace(/\.$/, '')
  initAccessKey(context, modelName)
  defProp(target, prop, _newValue)

  if (!isEqual(oldValue, _newValue)) {
    Reflect.set(target, prop, _newValue, receiver)
    domDepNotify.update(_accessKey, _newValue)
    return true
  }

  return false
}
