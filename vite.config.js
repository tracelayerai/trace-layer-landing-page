import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/trace-layer-landing-page/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
            },
        },
    },
});
