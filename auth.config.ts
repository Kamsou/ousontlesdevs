import GitHubProvider from 'next-auth/providers/github'

export default defineNuxtAuthHandler(() => {
  return {
    providers: [
      GitHubProvider({
        clientId: process.env.NUXT_AUTH_PROVIDER_GITHUB_ID!,
        clientSecret: process.env.NUXT_AUTH_PROVIDER_GITHUB_SECRET!
      })
    ]
  }
})
