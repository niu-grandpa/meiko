import { isUndef } from './equal'

const defineProperty = Object.defineProperty

export function defProp(target: object, prop: string | symbol, value: unknown) {
  if (!isUndef(target) && !Reflect.has(target, prop)) {
    defineProperty(target, prop, {
      value,
      configurable: true,
      writable: true,
      enumerable: true
    })
  }
}

export function defReadOnlyProp(
  target: object,
  prop: string | symbol,
  value: unknown
) {
  if (!isUndef(target) && !Reflect.has(target, prop)) {
    defineProperty(target, prop, {
      value,
      configurable: false,
      writable: false,
      enumerable: true
    })
  }
}

export function getRawType(value: unknown): string {
  // get the raw type of the value, like [object Object]
  return Object.prototype.toString.call(value).slice(8, -1)
}
