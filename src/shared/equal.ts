import {
  CLOSING_SLASH,
  END_TAG,
  LF_SCB,
  RT_SCB,
  SELF_CLOSING_TAG_END,
  START_TAG,
  WHITE_SPACE
} from '@/constant/htmlToken'
import { objectToString } from './object'

/**START_TAG */
export const isEqSTN = (value: string): boolean => {
  return value === START_TAG
}

/**END_TAG */
export const isEqETN = (value: string): boolean => {
  return value === END_TAG
}

/**SELF_CLOSING_TAG_END */
export const isEqSCTE = (value: string): boolean => {
  return value === SELF_CLOSING_TAG_END
}
/**CLOSING_SLASH */
export const isEqCSH = (value: string): boolean => {
  return value === CLOSING_SLASH
}

export const isEqLSCB = (value: string): boolean => {
  return value === LF_SCB
}

export const isEqRSCB = (value: string): boolean => {
  return value === RT_SCB
}

export const isEqSpace = (value: string): boolean => {
  return value === WHITE_SPACE
}

export const isNull = (value: any): value is null => {
  return value === null
}

export const isNumber = (value: any): value is number => {
  return typeof value === 'number'
}

export const isBool = (value: any): value is boolean => {
  return typeof value === 'boolean'
}

export const isUndef = (value: any): value is undefined => {
  return typeof value === 'undefined'
}

export const isArray = (value: any): value is any[] => {
  return Array.isArray(value)
}

export const isObject = (value: any): value is Record<any, any> => {
  return value !== null && typeof value === 'object'
}

export const isFunction = (value: any): value is Function => {
  return objectToString.call(value) === '[object Function]'
}

export const isPlainObject = (value: any): boolean => {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true

  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    for (let i = 0; i < aKeys.length; i++) {
      const key = aKeys[i]
      if (!isEqual(a[key], b[key])) return false
    }
    return true
  }

  return false
}
