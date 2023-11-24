import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const createOutput = (suffix, format, options = {}) => {
  const obj = {
    file: `dist/meiko.${suffix}`,
    format: format ?? suffix
  }
  return Object.assign(obj, options)
}

const outputOptions = {
  cjs: createOutput('cjs'),
  mjs: createOutput('mjs', 'esm'),
  umd: createOutput('umd.js', 'umd', { name: 'Meiko' })
}

export default {
  input: 'src/index.ts',
  output: Object.values(outputOptions),
  plugins: [
    commonjs(),
    resolve(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    typescript(),
    alias({ entries: [{ find: '@', replacement: './src' }] }),
    terser(),
    nodePolyfills()
  ]
}
