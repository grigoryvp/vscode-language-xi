import * as esbuild from 'esbuild';

esbuild.build({
  bundle: true,
  outfile: './out/extension.js',
  entryPoints: ['./src/extension.mjs'],
  external: ['vscode', 'process', 'util', 'path', 'fs', 'os'],
  format: 'cjs',
  platform: 'neutral',
});
