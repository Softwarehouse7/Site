import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base =
  process.env.GITHUB_ACTIONS === 'true' &&
  repositoryName &&
  !repositoryName.endsWith('.github.io')
    ? `/${repositoryName}/`
    : '/';

export default defineConfig(() => {
  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': projectRoot,
      },
    },
  };
});
