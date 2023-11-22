/* eslint-disable no-restricted-globals */

const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['jest'],
  rules: {
    'no-debugger': 'error',
    // most of the codebase are expected to be env agnostic
    'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals],

    'no-restricted-syntax': [
      'error',
      // since we target ES2015 for baseline support, we need to forbid object
      // rest spread usage in destructure as it compiles into a verbose helper.
      'ObjectPattern > RestElement',
      // tsc compiles assignment spread into Object.assign() calls, but esbuild
      // still generates verbose helpers, so spread assignment is also prohiboted
      'ObjectExpression > SpreadElement',
      'AwaitExpression'
    ]
  },
  overrides: [
    // tests, no restrictions (runs in Node / jest with jsdom)
    {
      files: ['**/__tests__/**'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error'
      }
    },
    {
      files: ['src/**'],
      rules: {
        'no-restricted-globals': ['error', ...NodeGlobals],
        'no-restricted-syntax': 'off'
      }
    }
  ]
}
