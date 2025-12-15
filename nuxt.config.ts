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
    provider: {
      type: 'authjs'
    },
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    basePath: '/api/auth',
    enableGlobalAppMiddleware: false
  },
  nitro: {
    preset: 'netlify',
    experimental: {
      asyncContext: true
    }
  }
})
