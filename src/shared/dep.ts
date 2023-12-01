import { isNull } from '@/helper/equal'

let DomSubscribe: DomDepSubscribe

function createSubscribe() {
  if (!DomSubscribe) {
    DomSubscribe = new DomDepSubscribe()
  }
  return DomSubscribe
}

class DomDepSubscribe {
  private map: Record<string, Set<string>> = Object.create(null)

  private has(key: string) {
    return key in this.map
  }

  get(key: string) {
    if (isNull(this.has(key))) return null
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
    if (isNull(ids)) return
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
