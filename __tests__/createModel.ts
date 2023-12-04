import { createModel } from './../src/meiko'

describe('CreateModel test', () => {
  const target = {
    foo: 'foo',
    fn: () => 'hello world',
    map: new Map(),
    set: new Set(),
    arr: [1],
    deep: {
      a: 'a',
      b: {
        c: 'ok'
      },
      d: {
        e: 'no',
        f: {
          g: 'one'
        }
      }
    }
  }

  const proxy = createModel('proxy', () => target)

  describe('Test object', () => {
    test('Test normal setter', () => {
      proxy.foo = 'oof'
      expect(proxy.foo).toEqual('oof')
    })
    test('Test deep getter and setter', () => {
      proxy.deep.a = 'rab'
      proxy.deep.b.c = 'no'
      proxy.deep.d.e = 'yes'
      proxy.deep.d.f.g = 'two'
      expect(proxy.deep.a).toEqual('rab')
      expect(proxy.deep.b.c).toEqual('no')
      expect(proxy.deep.d.e).toEqual('yes')
      expect(proxy.deep.d.f.g).toEqual('two')
    })
    test('Test duplicate proxy', () => {
      const cloneProxy = createModel('cloneProxy', () => proxy)
      const cloneTarget = createModel('cloneTarget', () => target)
      expect(cloneProxy).toBe(proxy)
      expect(cloneTarget).toBe(proxy)
    })
  })

  test('Test Function', () => {
    expect(proxy.fn()).toEqual('hello world')
    proxy.fn = () => 'i am new world'
    expect(proxy.fn()).not.toEqual('hello world')
  })

  describe('Test Array', () => {
    test('push', () => {
      proxy.arr.push(2, 3, 4)
      expect(proxy.arr).toContain(2)
      expect(proxy.arr).toContain(3)
      expect(proxy.arr).toContain(4)
    })
    test('pop', () => {
      proxy.arr.pop()
      expect(proxy.arr).not.toContain(4)
    })
    test('splice', () => {
      proxy.arr.splice(0, 1)
      expect(proxy.arr).not.toContain(1)
    })
    test('empty', () => {
      proxy.arr.length = 0
      expect(proxy.arr.length).toEqual(0)
    })
  })

  describe('Test Map', () => {
    test('set', () => {
      proxy.map.set('a', 1)
      proxy.map.set('b', 2)
      proxy.map.set('c', 3)
      expect([...proxy.map.values()]).toEqual([1, 2, 3])
      expect([...proxy.map.keys()]).toEqual(['a', 'b', 'c'])
    })
    test('get', () => {
      expect(proxy.map.get('a')).toEqual(1)
      expect(proxy.map.get('b')).toEqual(2)
    })
    test('delete', () => {
      proxy.map.delete('b')
      expect(proxy.map.size).toEqual(2)
      expect(proxy.map.has('b')).toEqual(false)
    })
  })

  describe('Test Set', () => {
    test('add', () => {
      proxy.set.add(1)
      expect(proxy.set.size).toEqual(1)
      expect(proxy.set).toContain(1)
    })
    test('delete', () => {
      proxy.set.delete(1)
      expect(proxy.set.has(1)).toEqual(false)
    })
  })
})
