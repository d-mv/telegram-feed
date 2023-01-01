module.exports = {
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    // 'react-app',
    'plugin:eslint-comments/recommended',
    'plugin:import/typescript',
    'plugin:json/recommended',
    'plugin:jest/recommended',
    'plugin:markdown/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:jsdoc/recommended',
    'plugin:regexp/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 16,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@getify/proper-arrows',
    '@typescript-eslint',
    'async-await',
    'eslint-comments',
    'import',
    'jest',
    'prettier',
    'react',
    'promise',
    // 'ramda',
    'jsdoc',
    'regexp',
    'testing-library',
    'html',
  ],
  rules: {
    'jsdoc/require-jsdoc': 'off',
    'react/react-in-jsx-scope': 'off',
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'promise/always-return': 'error',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-callback-in-promise': 'warn',
    'promise/avoid-new': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'warn',
    // 'node/exports-style': ['error', 'module.exports'],
    // 'node/file-extension-in-import': ['error', 'always'],
    // 'node/prefer-global/buffer': ['error', 'always'],
    // 'node/prefer-global/console': ['error', 'always'],
    // 'node/prefer-global/process': ['error', 'always'],
    // 'node/prefer-global/url-search-params': ['error', 'always'],
    // 'node/prefer-global/url': ['error', 'always'],
    // 'node/prefer-promises/dns': 'error',
    // 'node/prefer-promises/fs': 'error',
    complexity: ['error', 10],
    // 'ramda/always-simplification': 'error',
    // 'ramda/any-pass-simplification': 'error',
    // 'ramda/both-simplification': 'error',
    // 'ramda/complement-simplification': 'error',
    // 'ramda/compose-pipe-style': 'error',
    // 'ramda/compose-simplification': 'error',
    // 'ramda/cond-simplification': 'error',
    // 'ramda/either-simplification': 'error',
    // 'ramda/eq-by-simplification': 'error',
    // 'ramda/filter-simplification': 'error',
    // 'ramda/if-else-simplification': 'error',
    // 'ramda/map-simplification': 'error',
    // 'ramda/merge-simplification': 'error',
    // 'ramda/no-redundant-and': 'error',
    // 'ramda/no-redundant-not': 'error',
    // 'ramda/no-redundant-or': 'error',
    // 'ramda/pipe-simplification': 'error',
    // 'ramda/prefer-both-either': 'error',
    // 'ramda/prefer-complement': 'error',
    // 'ramda/prefer-ramda-boolean': 'error',
    // 'ramda/prop-satisfies-simplification': 'error',
    // 'ramda/reduce-simplification': 'error',
    // 'ramda/reject-simplification': 'error',
    // 'ramda/set-simplification': 'error',
    // 'ramda/unless-simplification': 'error',
    // 'ramda/when-simplification': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 3,
      },
    ],
    '@typescript-eslint/no-redeclare': 'off',
    '@getify/proper-arrows/params': [
      'error',
      {
        unused: 'none',
        trivial: false,
        count: 15,
        length: 0,
        allowed: ['key'],
      },
    ],
    'no-useless-catch': 'error',
    'no-self-compare': 'error',
    'no-useless-return': 'error',
    'no-const-assign': 'error',
    'no-useless-constructor': 'error',
    'no-param-reassign': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'keyword-spacing': 'error',
    'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
    // radix: 'error',
    'no-var': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: false }],
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    '@typescript-eslint/semi': ['off', null],
    'async-await/space-after-async': 2,
    'async-await/space-after-await': 2,
    'block-spacing': ['error', 'always'],
    'lines-around-comment': [0],
    'lines-between-class-members': ['error', 'always'],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['error', 15],
    'max-params': ['error', 4],
    'newline-per-chained-call': ['off'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-multi-spaces': ['error'],
    'no-multiple-empty-lines': ['error'],
    'no-spaced-func': ['error'],
    'no-whitespace-before-property': ['error'],
    'prettier/prettier': 'error',
    'space-before-blocks': ['error', 'always'],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'const', next: '*' },
      { blankLine: 'always', prev: '*', next: 'const' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'for', next: '*' },
      { blankLine: 'always', prev: '*', next: 'for' },
      { blankLine: 'always', prev: 'switch', next: '*' },
      { blankLine: 'always', prev: '*', next: 'switch' },
      { blankLine: 'always', prev: 'try', next: '*' },
      { blankLine: 'always', prev: '*', next: 'try' },
      { blankLine: 'always', prev: 'export', next: '*' },
      { blankLine: 'always', prev: '*', next: 'export' },
    ],
    'eslint-comments/disable-enable-pair': [
      'error',
      {
        allowWholeFile: true,
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        // project: 'path/to/folder',

        // // Multiple tsconfigs (Useful for monorepos)

        // // use a glob pattern
        // project: 'packages/*/tsconfig.json',

        // // use an array
        // project: ['packages/module-a/tsconfig.json', 'packages/module-b/tsconfig.json'],

        // // use an array of glob patterns
        // project: ['packages/*/tsconfig.json', 'other-packages/*/tsconfig.json'],
      },
    },
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: '0.53', // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' },
      // for rules that check exact prop wrappers
      { property: 'forbidExtraProps', exact: true },
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      { property: 'styled' }, // `object` is optional
      { property: 'observer', object: 'Mobx' },
      { property: 'observer', object: '<pragma>' }, // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      'CustomForm',
      { name: 'Form', formAttribute: 'endpoint' },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' },
    ],
  },
};
