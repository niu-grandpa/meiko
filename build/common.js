const alias = require('@rollup/plugin-alias')
const babel = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve')
const nodePolyfills = require('rollup-plugin-polyfill-node')
const typescript = require('rollup-plugin-typescript2')

const createOutput = (suffix, format, options = {}) => {
  const obj = {
    file: `dist/meiko.${suffix}`,
    format: format || suffix,
    name: 'Meiko'
  }
  return Object.assign(obj, options)
}

const mergeConfig = (config1, config2) => {
  return Object.assign({}, config2, config1, {
    plugins: config1.plugins.concat(config2.plugins)
  })
}

const baseConfig = {
  input: 'src/index.ts',
  plugins: [
    commonjs(),
    resolve(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    typescript(),
    alias({ entries: [{ find: '@', replacement: './src' }] }),
    json(),
    nodePolyfills()
  ]
}

module.exports = {
  createOutput: createOutput,
  mergeConfig: mergeConfig,
  baseConfig: baseConfig
}
