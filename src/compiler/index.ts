import { error, log } from 'node:console'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import colors from 'picocolors'
import { compileCreator } from './creator'
import { isFileExists, removePathBeforeSrc } from './shared'
import { CompileResult } from './types/compileResult'
import { MeikoConfig } from './types/meikoConfig'

export enum OUTPUT_FILE {
  HTML = 'index.html',
  DEFAULT_JS = 'index.js',
  RUNTIME_JS = 'runtime.js'
}

export function compileFunction(config: MeikoConfig) {
  if (!config.root) {
    return error('Project configuration is missing root field.')
  }
  if (!config.pages) {
    return error('Project configuration is missing pages field.')
  }
  if (!config.pages.length) {
    return error('No pages found.')
  }

  config.baseUrl = config.baseUrl || ''
  config.mode = config.mode || 'production'

  config.pages.forEach(field => {
    field.path = path.resolve(
      config.root,
      config.baseUrl!,
      'src',
      field.path,
      OUTPUT_FILE.HTML
    )
  })

  const runTask = async () => {
    const isAllFilesExist = config.pages.every(({ path }) => {
      return isFileExists(path, () => {
        error(`File not found: ${path}`)
      })
    })
    if (!isAllFilesExist) return

    const sct = performance.now()
    const compileResults = startCompile()
    const ect = performance.now()

    const buildConfig = genBuildConfig(compileResults)

    log('编译耗时:', `${~~(ect - sct)}ms`)
  }

  const startCompile = (): CompileResult[] => {
    log('Start compiling...')

    const compiler = compileCreator()
    const compileResults: CompileResult[] = []

    for (const { path: filepath } of config.pages) {
      log(colors.green('Compiling'), removePathBeforeSrc(filepath))
      const html = readFileSync(filepath, 'utf-8')
      const result = compiler(html)
      compileResults.push(result)
    }

    return compileResults
  }

  const genBuildConfig = (data: CompileResult[]) => {
    log('Processing compilation results...')
    // TODO
    // 2.生成webpack配置，调用 webpack-merge 合并prod配置
    // {
    //   entry: {
    //     'home/index': './src/home/index.js',
    //   },
    //   output: {
    //      path: path.resolve(root, baseUrl, outDir),
    //   },
    //   plugins: [
    //     new HtmlWebpackPlugin({
    //       template: 'src/home/index.temp',
    //       filename: `${filepath}/index.html`,
    //       chunks: [`${filepath}/index`]
    //     }),
    //   ]
    // }
  }

  const genTempBuildTarget = () => {
    log('Generating ad hoc build...')
    // TODO
    // 1.将编译的代码生成到临时文件
  }

  const startBuilding = async () => {
    log('Building...')
  }

  runTask()
}
