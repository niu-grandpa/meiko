import quickHash from 'quick-hash'

function hashFactory(): (string: string) => string {
  const hashMap: Record<string, string> = {}

  let sid = 0

  const func = (string: string): string => {
    let unique = string
    while (hashMap[unique]) {
      // 同样的键也生成不同的哈希值，这样可以避免一个domid对应多个dom节点，需要遍历
      unique = `${unique}_${sid++}`
    }
    const hash = quickHash(unique)
    return (hashMap[string] = hash)
  }

  return func
}

const createHashByString = hashFactory()

export default createHashByString
