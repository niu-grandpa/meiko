const { baseConfig, createOutput, mergeConfig } = require('./common.js')

const devConfig = mergeConfig(baseConfig, {
  output: [
    createOutput('js', 'umd', { sourcemap: true }),
    createOutput('esm.js', 'esm', { sourcemap: true }),
    createOutput('common.js', 'cjs', { exports: 'auto', sourcemap: true })
  ]
})

module.exports = devConfig
