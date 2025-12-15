// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  modules: [
    '@sidebase/nuxt-auth'
  ],
  auth: {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    enableGlobalAppMiddleware: false
  },
  nitro: {
    preset: 'netlify',
    experimental: {
      asyncContext: true
    }
  }
})
