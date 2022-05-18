import fs from 'fs';
import { esbuildPlugin } from '@web/dev-server-esbuild';

const packages = fs.readdirSync('packages').filter((dir) => fs.statSync(`packages/${dir}`).isDirectory());

export default {
  concurrency: 10,
  nodeResolve: true,
  watch: process.argv.includes('--watch'),
  groups: packages.map((pkg) => ({
    name: pkg,
    files: `packages/${pkg}/spec/**/*.spec.ts`,
  })),
  plugins: [esbuildPlugin({ ts: true })],
};
