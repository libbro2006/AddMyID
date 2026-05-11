import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://addmyid.info',
  integrations: [tailwind()],
  output: 'static',
});
