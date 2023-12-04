export function getRawType(value: unknown): string {
  // get the raw type of the value, like [object Object]
  return Object.prototype.toString.call(value).slice(8, -1)
}
