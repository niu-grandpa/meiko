type DepMap = Record<string, Set<string>>

type DomIdDepMap = Readonly<{
  has(key: string): Set<string> | null
  get(key: string): Set<string> | null
  add(key: string, value: string): void
  remove(key: string): boolean
}>

const depMap: DepMap = Object.create(null)

const domIdDepMap: DomIdDepMap = Object.freeze({
  has(key: string) {
    const value = depMap[key]
    if (!value) return null
    return value
  },

  get(key: string) {
    if (!this.has(key)) return null
    return depMap[key]
  },

  add(key: string, value: string) {
    if (!this.has(key)) {
      depMap[key] = new Set()
    }
    depMap[key].add(value)
  },

  remove(key: string) {
    if (!this.has(key)) return false
    delete depMap[key]
    return true
  }
})
