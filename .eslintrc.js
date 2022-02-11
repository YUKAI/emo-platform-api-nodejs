module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {}
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard-with-typescript'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
        alwaysTryTypes: true
      }
    },
  },
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/strict-boolean-expressions': ['off'],
    '@typescript-eslint/no-floating-promises': ['off'],
    '@typescript-eslint/default-param-last': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
    'no-new': ['off'],
    'no-console': ['warn'],
    'comma-dangle': ['error', 'only-multiline']
  }
}

/*
  Rules:
    https://github.com/typescript-eslint/typescript-eslint#readme
*/
