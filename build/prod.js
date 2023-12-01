import { terser } from '@rollup/plugin-terser'
import { commonConfig, createOutput, mergeConfig } from './common'

const prodConfig = mergeConfig(commonConfig, {
  output: [
    createOutput('min.js', 'umd'),
    createOutput('esm.min.js', 'esm'),
    createOutput('common.min.js', 'cjs', { exports: 'auto' })
  ],
  plugins: [terser({ sourceMap: true })]
})

export default prodConfig
