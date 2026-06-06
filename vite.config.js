import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base path for GitHub Pages — site is served at /tea-concept-2/, not /
  // Without this, all /assets/... paths 404 after deployment.
  base: '/tea-concept-2/',

  resolve: {
    // Force all packages to share a single React instance.
    // Required when using @react-three/fiber (R3F bundles its own renderer).
    dedupe: ['react', 'react-dom', 'three'],
    alias: {
      react:     path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      three:     path.resolve('./node_modules/three'),
    },
  },
})
