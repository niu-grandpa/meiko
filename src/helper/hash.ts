import crypto from 'crypto'

function interpHashCreator() {
  const hashMap = new Map<string, string>()

  const computeHash = (key: string): string => {
    const md5Hash = crypto.createHash('md5').update(key).digest('hex')
    const firstFour = md5Hash.slice(0, 4)
    const middleThree = md5Hash.slice(
      ~~(md5Hash.length / 2) - 1,
      ~~(md5Hash.length / 2) + 2
    )
    const lastThree = md5Hash.slice(md5Hash.length - 3)
    return firstFour + middleThree + lastThree
  }

  const creator = (key: string) => {
    if (hashMap.has(key)) {
      return hashMap.get(key)!
    }
    const hash = computeHash(key)
    hashMap.set(key, hash)
    return hash
  }

  return creator
}

const getInterpHash = interpHashCreator()

export default getInterpHash
