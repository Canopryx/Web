import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://canopryx.com",
  adapter: vercel(),
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
