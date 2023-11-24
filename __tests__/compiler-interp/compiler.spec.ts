import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { meikoCompiler } from '../../src'

test('编译只含有插值语法的模板', () => {
  const template = readFileSync(
    path.resolve(__dirname, './template.html'),
    'utf8'
  )
  const { result } = meikoCompiler(template)

  writeFileSync(
    path.resolve(__dirname, './build.html'),
    result.join(''),
    'utf8'
  )
})
