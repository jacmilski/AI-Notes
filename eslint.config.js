import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([ 'dist' ]),
  {
    files: [ '**/*.{js,jsx}' ],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'indent': [ 'error', 2 ],
      'no-mixed-spaces-and-tabs': 'off',
      'array-bracket-spacing': [ 'error', 'always', {
        'objectsInArrays': false,
        'arraysInArrays': false
      }],
      'jsx-quotes': [ 'error', 'prefer-single' ],
      'keyword-spacing': 'error',
      'object-curly-spacing': [ 'error', 'always', {
        'arraysInObjects': false,
        'objectsInObjects': false
      }],
      'quotes': [ 'error', 'single', { 'allowTemplateLiterals': true }],
      'semi': [ 'error', 'never' ]
    },
  },
])
