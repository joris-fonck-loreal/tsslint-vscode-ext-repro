import { defineConfig, definePlugin } from '@tsslint/config'
import { loadPluginRules } from '@tsslint/eslint'

export default defineConfig({
  rules: {
    ...(await loadPluginRules({
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-exports': ['error', {
        fixMixedExportsWithInlineTypeSpecifier: true,
      }],
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', {
        ignoreArrowShorthand: false,
        ignoreVoidOperator: false,
      }],
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': ['error', {
        ignoreStringArrays: true,
      }],
      '@typescript-eslint/restrict-plus-operands': ['error', {
        skipCompoundAssignments: false,
      }],
      // '@typescript-eslint/return-await': ['error', 'always'], // Not working
    })).rules,
  },
  plugins: [
    definePlugin(({ languageService }) => ({
      resolveDiagnostics(fileName, results) {
        const sourceFile = languageService.getProgram()?.getSourceFile(fileName)
        if (!sourceFile) {
          return results
        }
  
        const comments = [...sourceFile.text.matchAll(/\/\/ @tsslint-ignore/g)]
        const lines = new Set(comments.map(comment => sourceFile.getLineAndCharacterOfPosition(comment.index).line))
  
        return results.filter(error => error.source !== 'tsslint' || !lines.has(sourceFile.getLineAndCharacterOfPosition(error.start).line - 1))
      },
    }))
  ],
})