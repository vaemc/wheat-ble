import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import commonjsExternals from 'vite-plugin-commonjs-externals'
import vue from '@vitejs/plugin-vue'
const externals = ['@abandonware/noble']
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      commonjsExternals({
        externals
      })
    ]
  }
})
