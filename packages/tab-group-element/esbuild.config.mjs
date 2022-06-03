import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    inject: ['src/tab-list-element.ts', 'src/tab-panel-element.ts'],
    outfile: 'dist/index.js',
    watch: process.argv.includes('--watch'),
    bundle: true,
    minify: true,
    sourcemap: true,
  })
  .catch(() => process.exit(1));
