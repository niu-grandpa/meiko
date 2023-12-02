import { isUndef } from '@/helper/equal'
import { getElemById, setContent } from '../shared/dom'
import { DomSubscribe } from './dep'

let domDepNotify: DomDepNotify

function createNotify() {
  if (!domDepNotify) {
    domDepNotify = new DomDepNotify()
  }
  return domDepNotify
}

class DomDepNotify {
  update(key: string, value: string) {
    const sub = DomSubscribe.get(key)
    if (isUndef(sub)) return
    sub.forEach(id => {
      const el = getElemById(id)
      if (!el) {
        sub.delete(id)
      } else {
        setContent(el, value)
      }
    })
  }
}

createNotify()

export { domDepNotify }
