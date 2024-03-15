import { EventDescriptor } from '@/compiler/types/compilerContext'
import { EVENT_ID_NAME } from '@/constant/datasetKey'
import createHashByString from '@/shared/hash'

interface ReturnValue {
  attr: string
  evObj: EventDescriptor
}

export default function parseEvent(name: string, handler: string): ReturnValue {
  const type = name.substring(2).toLowerCase()
  const id = createHashByString(type + handler)
  const attr = `${EVENT_ID_NAME}="${id}"`
  const evObj: EventDescriptor = {
    id,
    type,
    handler
  }
  return { attr, evObj }
}
