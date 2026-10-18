import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'cwx-';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
  esbuild: { jsx: 'automatic' },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
});

