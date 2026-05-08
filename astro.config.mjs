import { defineConfig } from "astro/config";
import tailwindcss from '@tailwindcss/vite';
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react(), mdx()],
  site: "https://github.com/Eli-Yangg/yangyi.github.io",
});