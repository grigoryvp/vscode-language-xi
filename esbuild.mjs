import * as esbuild from 'esbuild';

esbuild.build({
  bundle: true,
  outfile: './out/extension-node.js',
  entryPoints: ['./src/extension.mjs'],
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
});

esbuild.build({
  bundle: true,
  outfile: './out/extension-browser.js',
  entryPoints: ['./src/extension.mjs'],
  external: ['vscode', 'process', 'util', 'path', 'fs', 'os'],
  format: 'cjs',
  platform: 'browser',
});
