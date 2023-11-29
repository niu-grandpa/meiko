import { isNull, isUndef } from '@/helper/equal'

type DepMap = Record<string, Set<string>>

type DomIdDepMap = Readonly<{
  has(key: string): Set<string> | null
  get(key: string): Set<string> | null
  add(key: string, value: string): void
  removeOne(key: string, id: string): void
  removeAll(key: string): boolean
}>

const depMap: DepMap = Object.create(null)

const domIdDepMap: DomIdDepMap = Object.freeze({
  has(key: string) {
    const value = depMap[key]
    if (!isUndef(value)) return null
    return value
  },

  get(key: string) {
    if (!isNull(this.has(key))) return null
    return depMap[key]
  },

  add(key: string, value: string) {
    if (!isNull(this.has(key))) {
      depMap[key] = new Set()
    }
    depMap[key].add(value)
  },

  removeOne(key: string, id: string) {
    const ids = this.get(key)
    if (isNull(ids)) return
    ids.delete(id)
    if (ids.size === 0) {
      this.removeAll(key)
    }
  },

  removeAll(key: string) {
    if (!isNull(this.has(key))) return false
    delete depMap[key]
    return true
  }
})

export default domIdDepMap
