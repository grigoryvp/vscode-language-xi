import * as esbuild from 'esbuild';

esbuild.build({
  bundle: true,
  outfile: './out/bundle.js',
  entryPoints: ['./src/extension.js'],
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
});
