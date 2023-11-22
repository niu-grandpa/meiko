import alias from '@rollup/plugin-alias'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const createOutput = (suffix, format) => ({
  file: `dist/meiko.${suffix}`,
  format: format ?? suffix
})

export default {
  input: 'src/index.ts',
  output: [
    createOutput('cjs'),
    createOutput('mjs', 'esm'),
    Object.assign(createOutput('js', 'iife'), { name: 'Meiko' })
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    typescript(),
    alias({
      entries: [{ find: '@', replacement: './src' }]
    }),
    terser()
  ]
}
