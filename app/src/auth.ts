import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"

// Behind the GKE ingress, request headers don't reliably carry the external host,
// so pin the redirect URL to HOST_URL instead of relying on header detection.
if (!process.env.AUTH_URL && process.env.HOST_URL) {
  process.env.AUTH_URL = process.env.HOST_URL
}

const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || undefined

const keycloak: Provider = {
  id: "fao",
  name: "FAO SSO",
  type: "oidc",
  issuer: process.env.KEYCLOAK_ISSUER,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret,
  // Public client: no client secret, authenticate with PKCE only.
  client: clientSecret ? undefined : { token_endpoint_auth_method: "none" },
  authorization: { params: { scope: process.env.KEYCLOAK_SCOPE } },
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [keycloak],
  trustHost: true,
  callbacks: {
    jwt({ token, account }) {
      if (account?.access_token) token.accessToken = account.access_token
      return token
    },
    session({ session, token }) {
      if (typeof token.accessToken === "string") session.accessToken = token.accessToken
      return session
    },
  },
})
