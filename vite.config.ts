import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_URL ?? '/',
  server: {
    open: true,
  },
  test: {
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
