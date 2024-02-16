export default function makeMapByString(
  string: string
): Record<string, string> {
  const map: Record<string, string> = {}
  string.split(',').forEach(char => {
    map[char] = char
  })
  return map
}
