import { isEqSpace } from '.'

type ParseTagNameResult = {
  jump: number
  name: string
  stopped: boolean
}

export function parseTagName(
  pos: number,
  source: string,
  stop: string
): ParseTagNameResult {
  let name = '',
    stopped = false
  while (source[pos] !== stop) {
    if (isEqSpace(source[pos])) {
      name += source[pos++]
    } else {
      stopped = true
      break
    }
  }
  return { jump: pos + 1, name, stopped }
}
