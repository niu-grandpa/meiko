export default function checkSize(arr: string | string[]): string {
  const dataTypeSizes: { [key: string]: number | ((value: any) => number) } = {
    number: 8,
    string: (value: string) => value.length * 2,
    object: 32
  }

  let totalSize = 0
  for (let i = 0; i < arr.length; i++) {
    const dataType = typeof arr[i]
    const size = dataTypeSizes[dataType]
    totalSize += typeof size === 'number' ? size : size(arr[i])
  }

  // 将内存占用大小从字节转换为 MB
  return (totalSize / 1024 ** 2).toFixed(2) + 'MB'
}
