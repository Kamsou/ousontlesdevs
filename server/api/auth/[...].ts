import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'

// @ts-ignore - CommonJS interop
const GitHub = GithubProvider.default || GithubProvider

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/',
  },
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.id = account.providerAccountId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
    redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/profil`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    }
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    })
  ]
})
