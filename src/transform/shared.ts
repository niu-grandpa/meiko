import colors from 'picocolors'

type ErrorTraceParams = {
  log: string
  line: number
  col: number
  file: string
}

export const errorTrace = (params: ErrorTraceParams) => {
  const { log, line, col, file } = params
  const trackingInfo = `at ${colors.white(file)} (${colors.underline(
    colors.magenta(`${file}:${line}:${col}`)
  )})`
  throw Error(`${colors.red(log)}\n  ${trackingInfo}`)
}

export const isTagNameValid = (str: string): boolean => {
  const regex = /^[a-zA-Z][a-zA-Z0-9_.-]*$/
  return regex.test(str)
}
