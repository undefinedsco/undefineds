import { defineConfig } from 'tsup';

export default defineConfig({
  bundle: true,
  cjsInterop: true,
  clean: true,
  entry: ['./electron/src/main.ts', './electron/src/preload.ts'],
  external: ['electron'],
  format: ['cjs'],
  outDir: 'build',
  skipNodeModulesBundle: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
});
