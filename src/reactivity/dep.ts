import { isNull, isUndef } from '@/helper/equal'

let DomSubscribe: DomDepSubscribe

function createSubscribe() {
  if (isUndef(DomSubscribe)) {
    DomSubscribe = new DomDepSubscribe()
  }
}

class DomDepSubscribe {
  private map: Record<string, Set<string>> = Object.create(null)

  private has(key: string) {
    return !isUndef(this.map[key])
  }

  get(key: string) {
    if (!this.has(key)) return
    return this.map[key]
  }

  add(key: string, value: string) {
    if (!this.has(key)) {
      this.map[key] = new Set()
    }
    this.map[key].add(value)
  }

  removeOne(key: string, id: string) {
    const ids = this.get(key)
    if (isUndef(ids)) return
    ids.delete(id)
    if (ids.size === 0) {
      this.removeAll(key)
    }
  }

  removeAll(key: string) {
    if (!isNull(this.has(key))) return false
    delete this.map[key]
    return true
  }
}

createSubscribe()

export { DomSubscribe }
