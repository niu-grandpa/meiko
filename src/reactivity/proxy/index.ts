import { defReadOnlyProp, getRawType } from '@/helper'
import { isObject } from '@/helper/equal'
import { ReactiveFlags } from '@/shared/constant/reactive'

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_DEEP]?: boolean
  [ReactiveFlags.RAW]?: any
}
export type ProxyKey = string | symbol
export type ProxyContext = {
  accessKey: string
  isReactive: boolean
  isReadOnly: boolean
  isDeep: boolean
}
export type CustromProxyHandler<T> = {
  target: T
  prop: ProxyKey
  receiver: any
  modelName: string
  context: ProxyContext
  handler: (modelName: string, context: ProxyContext) => ProxyHandler<object>
}
export type ProxyGetter<T> = CustromProxyHandler<T>
export type ProxySetter<T> = CustromProxyHandler<T> & { newValue: any }

export const specialType = [
  'Object',
  'Array',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet'
]

export const isReadonly = (value: unknown) => {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}
const isSpecialType = (value: unknown) => {
  return specialType.includes(getRawType(value)) && Object.isExtensible(value)
}

const targetMap = new WeakMap()
const proxyMap = new WeakMap()

export function createProxy<T>(
  target: T,
  context: ProxyContext,
  handler: ProxyHandler<object>
): T
export function createProxy(
  target: object,
  context: ProxyContext,
  handler: ProxyHandler<object>
) {
  if (!isObject(target)) {
    console.warn(
      `[Meiko warn]: value cannot be made reactive: ${String(target)}`
    )
    return target
  }
  if (!isSpecialType(target)) {
    console.warn(
      `[Meiko warn]: only specific value types can be observed: ${String(
        target
      )}`
    )
    return target
  }
  // if target is a readonly proxy, it will be returned directly without observation.
  if (isReadonly(target)) {
    return target
  }
  // target is already a Proxy, return it.
  if (proxyMap.has(target)) {
    return target
  }
  // target already has corresponding Proxy
  if (!targetMap.has(target)) {
    const { isReactive, isReadOnly: readOnlyFlag } = context
    const proxy = new Proxy(target, handler)

    defReadOnlyProp(proxy, ReactiveFlags.IS_READONLY, readOnlyFlag)
    defReadOnlyProp(proxy, ReactiveFlags.IS_REACTIVE, isReactive)

    targetMap.set(target, proxy)
    proxyMap.set(proxy, target)
  }
  return targetMap.get(target)
}
