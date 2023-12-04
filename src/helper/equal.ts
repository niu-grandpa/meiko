import {
  CLOSING_SLASH,
  END_TAG,
  LF_SCB,
  RT_SCB,
  START_TAG,
  WHITE_SPACE
} from '@/shared/const'

export function isEqSTN(value: string) {
  return value === START_TAG
}

export function isEqETN(value: string) {
  return value === END_TAG
}

export function isEqCSH(value: string) {
  return value === CLOSING_SLASH
}

export function isEqLSCB(value: string) {
  return value === LF_SCB
}

export function isEqRSCB(value: string) {
  return value === RT_SCB
}

export function isEqSpace(value: string) {
  return value === WHITE_SPACE
}

export function isNull(value: any): value is null {
  return value === null
}

export function isUndef(value: any): value is undefined {
  return typeof value === 'undefined'
}

export function isArray(value: any): value is [] {
  return Array.isArray(value)
}

export function isObject(value: any): value is Record<any, any> {
  return value !== null && typeof value === 'object'
}

export function isFunction(value: any): value is Function {
  return Object.prototype.toString.call(value) === '[object Function]'
}

export function isPlainObject(value: any): boolean {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function isEqual(a: any, b: any): boolean {
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
