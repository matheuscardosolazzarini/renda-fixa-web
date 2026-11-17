const { defineConfig, globalIgnores } = require('eslint/config');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const boundaries = require('eslint-plugin-boundaries');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores(['dist/**', 'coverage/**', '.angular/**', 'openapi/**', 'src/app/api/schema.ts']),

  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked, angular.configs.tsRecommended],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        node: { extensions: ['.ts'] },
      },
      'boundaries/files': [{ pattern: ['src/main.ts', 'src/app/app*.ts'], category: 'app' }],
      'boundaries/elements': [
        { type: 'feature', pattern: 'src/app/features/*', capture: ['name'] },
        { type: 'core', pattern: 'src/app/core' },
        { type: 'shared', pattern: 'src/app/shared' },
        { type: 'api', pattern: 'src/app/api' },
      ],
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'rf', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'rf', style: 'camelCase' }],
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { file: { categories: 'app' } },
              allow: { to: { file: { categories: 'app' } } },
            },
            {
              from: { file: { categories: 'app' } },
              allow: { to: { element: { type: ['core'] } } },
            },
            {
              from: { file: { categories: 'app' } },
              allow: { to: { element: { type: 'feature' }, file: { path: '**/*.routes.ts' } } },
            },
            {
              from: { element: { type: 'feature' } },
              allow: { to: { element: { type: ['core', 'shared', 'api'] } } },
            },
            {
              from: { element: { type: 'feature', captured: { name: '*' } } },
              allow: { to: { element: { type: 'feature', captured: { name: '{{ from.captured.name }}' } } } },
            },
            {
              from: { element: { type: 'core' } },
              allow: { to: { element: { type: ['core', 'shared', 'api'] } } },
            },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },
          ],
        },
      ],
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/no-unknown-files': 'error',
    },
  },

  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },

  eslintConfigPrettier,
]);
