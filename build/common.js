import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

export const createOutput = (suffix, format, options = {}) => {
  const obj = {
    file: `dist/meiko.${suffix}`,
    format: format ?? suffix,
    name: 'Meiko'
  }
  return Object.assign(obj, options)
}

export const mergeConfig = (target, source) => {
  for (const key in target) {
    const value = target[key]
    if (Array.isArray(value)) {
      source[key] = [...value, ...source[key]]
    } else {
      source[key] = target[key]
    }
  }
  return source
}

export const commonConfig = {
  input: 'src/index.ts',
  plugins: [
    commonjs(),
    resolve(),
    json(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    typescript(),
    alias({ entries: [{ find: '@', replacement: './src' }] }),
    nodePolyfills()
  ]
}
