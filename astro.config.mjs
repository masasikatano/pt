import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [
    react({
      include: ['**/react/**/*'],
    }),
    sitemap(),
  ],
  site: 'https://pt.p12r.workers.dev',
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL || 'https://pt.p12r.workers.dev'),
    },
    optimizeDeps: {
      include: ['react', 'react-dom/client'],
    },
  },
});
