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
    jwt({ token, account, profile }) {
      if (account) {
        token.id = account.providerAccountId
        token.login = (profile as { login?: string })?.login ?? ''
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.login = token.login
      }
      return session
    },
    redirect({ url, baseUrl }) {
      return `${baseUrl}/profil`
    }
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    })
  ]
})
