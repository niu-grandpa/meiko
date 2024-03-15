import { isArray, isUndef } from './equal'

const defineProp = Object.defineProperty

export const objectToString = Object.prototype.toString

export const defProp = (
  target: object,
  prop: string | symbol,
  value: unknown
) => {
  if (!isUndef(target) && !Reflect.has(target, prop)) {
    defineProp(target, prop, {
      value,
      configurable: true,
      writable: true,
      enumerable: true
    })
  }
}

export const defReadOnlyProp = (
  target: object,
  prop: string | symbol,
  value: unknown
) => {
  if (!isUndef(target) && !Reflect.has(target, prop)) {
    defineProp(target, prop, {
      value,
      configurable: false,
      writable: false,
      enumerable: true
    })
  }
}

export const getRawType = (value: unknown): string => {
  // get the raw type of the value, like [object Object]
  return objectToString.call(value).slice(8, -1)
}

export const mergeOptions = (source: any, target: any) => {
  if (!target) return source
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (!target.hasOwnProperty(key)) {
        target[key] = source[key]
      } else if (isArray(source[key]) && isArray(target[key])) {
        target[key] = target[key].concat(
          source[key].filter((item: any) => !target[key].includes(item))
        )
      } else if (
        typeof source[key] === 'object' &&
        typeof target[key] === 'object'
      ) {
        mergeOptions(source[key], target[key])
      }
    }
  }
  return target
}
