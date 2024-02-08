const terser = require('@rollup/plugin-terser')
const { baseConfig, createOutput, mergeConfig } = require('./common.js')

const prodConfig = mergeConfig(baseConfig, {
  output: [
    createOutput('esm.min.js', 'esm'),
    createOutput('common.min.js', 'cjs', { exports: 'auto' })
  ],
  plugins: [terser()]
})

module.exports = prodConfig
