import { commonConfig, createOutput, mergeConfig } from './common'

const devConfig = mergeConfig(commonConfig, {
  output: [
    createOutput('js', 'umd'),
    createOutput('esm.js', 'esm'),
    createOutput('common.js', 'cjs', { exports: 'auto' })
  ]
})

export default devConfig
