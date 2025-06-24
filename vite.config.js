import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    
    lib: {
      
      entry: resolve(__dirname, 'src/lib/index.js'),
      name: 'matzu-module', 
      fileName: 'matzu-module', 
    },
    rollupOptions: {
      
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})