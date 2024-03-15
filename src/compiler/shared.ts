import { EVENT_ID_NAME } from '@/constant/datasetKey'
import { formatPath, toJSON } from '@/shared/string'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { EventDescriptor } from './types/compilerContext'

export const compressHtml = (code: string): string => {
  return code
    .replace(/\s*(\r?\n|\r)\s*/g, ' ')
    .replace(/>\s+</g, '><')
    .trim()
}

type TerserCommandConfig = {
  isDev: boolean
  file: string
  outFile?: string
  sourceMap?: boolean
}

export const execTerserCmd = ({
  isDev,
  file,
  outFile,
  sourceMap
}: TerserCommandConfig) => {
  !isDev &&
    execSync(
      `npx terser ${file} -o ${outFile ?? file} -c -m ${
        sourceMap ? '--source-map' : ''
      }`
    )
}

export const execTscCmd = (isDev: boolean, file: string, outDir: string) => {
  const options = !isDev ? `--removeComments --sourceMap --strict` : ''
  const command = `tsc ${file} --outDir ${outDir} ${options}`
  execSync(command)
}

export const extractFilename = (path: string): string => {
  const segments = path.split(/[\\/]/) // 'a/b/c.html' -> ['a','b','c.html']
  return segments.pop()!.split('.')[0] // 'c.html' -> ['c','html']
}

export const getPathWithoutFilename = (path: string): string => {
  const segments = path.split(/[\\/]/)
  segments.pop()
  return segments.join('/')
}

export const isFileExists = (
  filePath: string,
  onError?: (err: unknown) => void
): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (err) {
    onError?.(err)
    return false
  }
}

export const ensureDirExist = (filePath: string) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return
  }
  ensureDirExist(dirname)
  fs.mkdirSync(dirname, { recursive: true })
}

export const writeFileWithDirSync = (filePath: string, content: string) => {
  ensureDirExist(filePath)
  fs.writeFileSync(filePath, content, 'utf8')
}

export const removePathBeforeSrc = (filePath: string) => {
  const index = filePath.indexOf('src')
  return formatPath(index !== -1 ? filePath.substring(index) : filePath)
}

export const trimCwdFromPath = (fullPath: string): string => {
  const normalizedFullPath = fullPath.replace(/\\/g, '/')
  const normalizedCwd = process.cwd().replace(/\\/g, '/') + '/'

  if (normalizedFullPath.startsWith(normalizedCwd)) {
    return normalizedFullPath.substring(normalizedCwd.length)
  }

  return formatPath(normalizedFullPath)
}

export const ensureHasBodyTag = (html: string): string => {
  html = html.trim()
  if (
    !html.startsWith('<!DOCTYPE') &&
    !html.startsWith('<html') &&
    !html.startsWith('<body>') &&
    !html.endsWith('</body>')
  ) {
    html = `<body>
      ${html}
     </body>`
  }
  return html
}

export interface ExtractScriptResult {
  cleanedStr: string
  internalScript: Array<{
    lang: 'js' | 'ts'
    code: string
  }>
}

export const extractScriptContent = (html: string): ExtractScriptResult => {
  const scriptWithoutSrcRegex = /<script(?:\s+ts)?>([\s\S]*?)<\/script>/g
  const tsAttributeRegex = /<script\s+ts>/ // 用于检测ts属性的正则表达式

  const result: ExtractScriptResult = {
    cleanedStr: '', // 存放处理后的字符串
    internalScript: []
  }

  // 提取并移除不带 src 的 script 标签
  let matchWithoutSrc
  while ((matchWithoutSrc = scriptWithoutSrcRegex.exec(html)) !== null) {
    const isTs = tsAttributeRegex.test(matchWithoutSrc[0]) // 检查是否包含ts属性
    if (matchWithoutSrc[1].trim()) {
      result.internalScript.push({
        lang: isTs ? 'ts' : 'js', // 根据是否匹配到ts属性决定语言
        code: matchWithoutSrc[1].trim()
      })
    }
  }

  result.cleanedStr = html.replace(scriptWithoutSrcRegex, '')
  return result
}

/**
 * 生成字符串格式的js运行时代码
 */
export const createRuntimeJsCode = {
  wrapper(code: string): string {
    return `(function() { 
      ${code}
     })();`
  },

  bindEvent(obj: EventDescriptor[]): string {
    const code = `
     const evHandlers = ${toJSON(obj)};
     evHandlers.forEach(({ id, type, handler }) => {
        const el = document.querySelector(\`[${EVENT_ID_NAME}="$\{id\}"]\`);
        const fn = Function(\`return $\{handler\}\`);
        el.addEventListener(type, fn());
     });
    `
    return this.wrapper(code)
  }
}
