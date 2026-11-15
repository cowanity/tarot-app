import { defineConfig } from 'vite';
import {loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';
import {pwaOptions} from './src/lib/pwaConfig';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode, command }) => {
 const env=loadEnv(mode,process.cwd(),'VITE_');const site=env.VITE_SITE_URL||process.env.VITE_SITE_URL;
 if(command==='build'&&!site)throw new Error('Set VITE_SITE_URL to the public HTTPS origin before building.');
 const base=site?new URL(site).origin:'http://localhost:5173';
 const indexable=env.VITE_ALLOW_INDEX==='true';
 return ({
  plugins: mode === 'test' ? [] : [react(), tailwindcss(), VitePWA(pwaOptions), {name:'tarot-metadata',transformIndexHtml(html){return html.replaceAll('__SITE_URL__',base).replace('__ROBOTS__',indexable?'index, follow':'noindex, nofollow');},generateBundle(){this.emitFile({type:'asset',fileName:'robots.txt',source:indexable?'User-agent: *\nAllow: /\n':'User-agent: *\nDisallow: /\n'});}}],
  build: {rollupOptions: {output: {onlyExplicitManualChunks:true,manualChunks(id) {
    if(id.includes('/node_modules/')) {
      if(/\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
      if(/\/(react|react-dom|scheduler)\//.test(id)) return 'react';
    }
    if(id.includes('/src/fx/')) return 'fx';
    if(id.includes('/src/data/') && id.endsWith('.json')) return 'card-data';
  }}}},
  server: { 
    allowedHosts: ['regarding-toner-africa-showcase.trycloudflare.com'],
    proxy: { '/api': 'http://localhost:8787' } },
});});
