import typescriptEslint from '@typescript-eslint/eslint-plugin';
import jest from 'eslint-plugin-jest';
import security from 'eslint-plugin-security';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc'; // Add JSDoc plugin
const commonRules = {
  // General Best Practices
  'no-cond-assign': 'off',
  'no-irregular-whitespace': 'error',
  curly: ['error', 'multi-line'],
  'guard-for-in': 'error',
  'no-caller': 'error',
  'no-extend-native': 'error',
  'no-extra-bind': 'error',
  'no-invalid-this': 'error',
  'no-multi-spaces': 'error',
  'no-multi-str': 'error',
  'no-new-wrappers': 'error',
  'no-throw-literal': 'error',
  'no-with': 'error',
  'prefer-promise-reject-errors': 'error',
  'prefer-const': ['error', { destructuring: 'all' }],
  'no-var': 'error',
  // Formatting Rules
  'array-bracket-spacing': ['error', 'never'],
  'block-spacing': ['error', 'never'],
  'brace-style': 'error',
  camelcase: ['error', { properties: 'never' }],
  'comma-dangle': ['error', 'always-multiline'],
  'comma-spacing': 'error',
  'comma-style': 'error',
  'computed-property-spacing': 'error',
  'eol-last': 'error',
  'func-call-spacing': 'error',
  'key-spacing': 'error',
  'keyword-spacing': 'error',
  'linebreak-style': 'error',
  'max-len': ['error', { code: 140, ignoreTemplateLiterals: true }],
  'no-mixed-spaces-and-tabs': 'error',
  'no-multiple-empty-lines': ['error', { max: 1 }],
  'no-trailing-spaces': 'error',
  'object-curly-spacing': ['error', 'always'],
  'one-var': ['error', { var: 'never', let: 'never', const: 'never' }],
  'padded-blocks': ['error', 'never'],
  'quote-props': ['error', 'consistent'],
  semi: 'error',
  'semi-spacing': 'error',
  'space-before-blocks': 'error',
  'space-before-function-paren': ['error', { asyncArrow: 'always', anonymous: 'never', named: 'never' }],
  'spaced-comment': ['error', 'always'],
  // JSDoc Rules (from eslint-plugin-jsdoc)
  'jsdoc/check-alignment': 'error', // Ensure proper alignment of JSDoc comments
  'jsdoc/check-param-names': 'error', // Ensure parameter names in JSDoc match function parameters
  'jsdoc/check-tag-names': 'error', // Ensure valid JSDoc tags
  'jsdoc/check-types': 'error', // Ensure types are correctly documented
  'jsdoc/require-jsdoc': [
    'error',
    {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
      },
    },
  ], // Require JSDoc comments for functions, methods, and classes
  // ES6+ Rules
  'arrow-parens': ['error', 'always'],
  'constructor-super': 'error',
  'generator-star-spacing': ['error', 'after'],
  'no-new-symbol': 'error',
  'no-this-before-super': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'rest-spread-spacing': 'error',
  'yield-star-spacing': ['error', 'after'],
  // Project-Specific
  'no-param-reassign': ['error', { props: false }],
  'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
  'no-underscore-dangle': ['error', { allow: ['_id'] }],
  'no-void': ['error', { allowAsStatement: true }],
  'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
  'import/no-default-export': 'off',
  'import/prefer-default-export': 'off',
  'prettier/prettier': ['error'],
};
const sharedPlugins = {
  typescriptEslint,
  security,
  jest,
  importPlugin,
  jsdoc, // Add JSDoc plugin
};
const settings = {
  extends: [
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:security/recommended-legacy',
    'prettier',
  ],
};
export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        tsconfigRootDir: '.',
        project: 'tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: sharedPlugins,
    rules: commonRules,
    ignores: ['**/node_modules/**', 'dist/**', 'typings/**'],
    settings,
  },
];
