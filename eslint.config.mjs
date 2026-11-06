import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { fileURLToPath } from 'node:url';

export default defineConfig([
  ...nextVitals, ...nextTs,
  { settings: { next: { rootDir: fileURLToPath(new URL('./apps/web/', import.meta.url)) } } },
  globalIgnores(['**/.next/**', '**/.next-build/**', '**/next-env.d.ts']),
]);
