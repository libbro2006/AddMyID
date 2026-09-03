import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://addmyid.info',
  integrations: [sitemap()],
  output: 'static',
});
