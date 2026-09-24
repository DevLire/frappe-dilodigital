import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://frappe-frappe-erpnext.uf8oit.easypanel.host',
        changeOrigin: true,
        secure: false,

        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });

          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader(
              'Host',
              'frappe-frappe-erpnext.uf8oit.easypanel.host'
            );
            proxyReq.setHeader(
              'X-Forwarded-Host',
              'frappe-frappe-erpnext.uf8oit.easypanel.host'
            );
            proxyReq.setHeader(
              'Origin',
              'https://frappe-frappe-erpnext.uf8oit.easypanel.host'
            );
            proxyReq.setHeader(
              'X-Frappe-Site-Name',
              'frappe-frappe-erpnext.uf8oit.easypanel.host'
            );
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            if (proxyRes.statusCode === 404) {
              console.log('404 for', req.url);
            }
          });
        },
      },
      '/private': {
        target: 'https://frappe-frappe-erpnext.uf8oit.easypanel.host',
        changeOrigin: true,
        secure: false,
      },
      '/files': {
        target: 'https://frappe-frappe-erpnext.uf8oit.easypanel.host',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
});
