import crypto from 'crypto'

function interpHashCreator() {
  const hashMap = new Map<string, string>()

  let uid = 0

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
    let k = key
    if (hashMap.has(key)) {
      // 同样的键也生成不同的哈希值，这样可以避免一个domid对应多个dom节点，需要遍历
      k = `${k}_${uid++}`
    }
    const hash = computeHash(k)
    hashMap.set(key, hash)
    return hash
  }

  return creator
}

const getInterpHash = interpHashCreator()

export default getInterpHash
