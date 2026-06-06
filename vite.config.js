import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Use relative base so built paths work everywhere:
  //   - VS Code Live Server (opens dist/index.html directly)
  //   - GitHub Pages (serves from repo subdirectory)
  //   - npm run preview
  base: './',

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
