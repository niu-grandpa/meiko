import crypto from 'crypto'

type HashGenerator = (data: string) => string

const set = new Set()
let hid = 1

export default function hashGenerator(): HashGenerator {
  const generateHash = (data: string) => {
    let newData = data
    if (set.has(newData)) {
      newData = `${data}_${hid++}`
      set.add(newData)
    } else {
      set.add(data)
    }
    const hash = crypto.createHash('md5').update(newData).digest('hex')
    return hash
  }

  return generateHash
}
