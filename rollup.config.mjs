import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

export default [
  {
    input: 'src/core/main.mjs',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      interop: 'default',
      exports: 'named',
      inlineDynamicImports: true,
      outro: 'module.exports = cssDeclarationSorter;',
    },
    plugins: [
      dynamicImportVars(),
    ],
  },
];
