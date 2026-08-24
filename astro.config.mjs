import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tylermiranda.com',
  integrations: [react(), tailwind(), sitemap()],
  output: 'static',
  adapter: cloudflare(),
});
