import * as esbuild from 'esbuild';

esbuild.build({
  bundle: true,
  outfile: './out/extension.js',
  entryPoints: ['./src/extension.mjs'],
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
});
