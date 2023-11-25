import crypto from 'crypto'

function md5HashCreator() {
  let id = 1
  const set = new Set<string>()

  const computeHash = (value: string): string => {
    const md5Hash = crypto.createHash('md5').update(value).digest('hex')
    const firstFour = md5Hash.slice(0, 4)
    const middleThree = md5Hash.slice(
      ~~(md5Hash.length / 2) - 1,
      ~~(md5Hash.length / 2) + 2
    )
    const lastThree = md5Hash.slice(md5Hash.length - 3)
    return firstFour + middleThree + lastThree
  }

  const creator = (name: string) => {
    let _name = name
    if (set.has(_name)) {
      _name = `${name}_${id++}`
    }
    set.add(_name)
    return computeHash(_name)
  }

  return creator
}

const createHash = md5HashCreator()

export default createHash
