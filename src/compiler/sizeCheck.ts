export default function checkSize(arr: string[]): string {
  let size: number = 0
  arr.forEach(item => {
    if (typeof item === 'string') {
      size += Buffer.byteLength(item, 'utf8')
    } else if (typeof item === 'number') {
      // Assuming each number occupies 8 bytes
      size += 8
    }
  })
  return (!size ? 0 : ~~(size / 1024).toFixed(2)) + ' kb'
}
