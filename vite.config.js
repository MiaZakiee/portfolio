import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function seoPlugin() {
  return {
    name: 'seo-inject',
    transformIndexHtml() {
      const seo = JSON.parse(
        readFileSync(resolve(__dirname, 'src/data/seo.json'), 'utf-8')
      );

      const tags = [
        { tag: 'title', children: seo.title, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'description', content: seo.description }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'canonical', href: seo.canonical }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'theme-color', content: seo.themeColor }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', href: seo.favicon }, injectTo: 'head' },
        // Open Graph
        { tag: 'meta', attrs: { property: 'og:title', content: seo.og.title }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: seo.og.description }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: seo.og.image }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: seo.og.url }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: seo.og.type }, injectTo: 'head' },
        // Twitter
        { tag: 'meta', attrs: { name: 'twitter:card', content: seo.twitter.card }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:title', content: seo.twitter.title }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:description', content: seo.twitter.description }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: seo.twitter.image }, injectTo: 'head' },
        // JSON-LD
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(seo.jsonLd),
          injectTo: 'head',
        },
      ];

      return tags;
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), seoPlugin()],
  resolve: {
    alias: {
      '@': '/src',
      '@data': '/src/data',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@styles': '/src/styles',
    },
  },
});
