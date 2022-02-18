module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/typescript'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 2,
    'import/order': [2, {'newlines-between': 'always'}],
    'import/namespace': 0, // https://github.com/import-js/eslint-plugin-import/issues/1845
    'import/no-unresolved': 2,
    'import/no-dynamic-require': 2,
    'import/no-mutable-exports': 2,
    'import/export': 2,
    'import/no-commonjs': 2,
    'import/first': 2,
    'import/newline-after-import': 2,
    'import/exports-last': 0,
    'eqeqeq': 2,
    'no-param-reassign': 2,
    'curly': 2,
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};
