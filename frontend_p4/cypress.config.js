import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    //baseUrl: 'http://localhost:4173',
    baseUrl: 'https://four-songproject-99-2311-2026-v1.onrender.com',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  env: {
    username: 'alumnodb',
    password: 'alumnodb',
  },
})
