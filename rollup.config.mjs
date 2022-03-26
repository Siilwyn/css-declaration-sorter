import replace from '@rollup/plugin-replace';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

export default [
  {
    input: 'src/main.mjs',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      interop: 'default',
      exports: 'named',
      inlineDynamicImports: true,
      intro: `const stableSort = require('./stable-sort.cjs');`,
      outro: 'module.exports = cssDeclarationSorter;',
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        preventAssignment: true,
        'nodes\.sort\(': 'stableSort(nodes,',
      }),
      dynamicImportVars.default(),
    ],
  },
  {
    input: ['src/stable-sort.cjs'],
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    }
  },
];
