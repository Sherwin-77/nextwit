import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from "next-auth/providers/google"

export const authOptions = {

}

// TODO: Implement OAuth
const handler = NextAuth({
  /**
   * Note for myself in future:
   *  JWT Flow
   *  Credentials -> authorize callback return user -> session callback return session with user updated
   * CMIIW
   * Source Used:
   * https://github.com/nextauthjs/next-auth/discussions/8150
   */
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "Username",
          type: "text"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(`${process.env.NEXT_API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.message);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // })
  ],
  theme: {
    colorScheme: "auto",
    brandColor: "#0062ff",
    buttonText: "#0062ff",
    logo: "/logo.png"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // This will be executed at login
        token = {
          ...token,
          user: user,
          id: user.id,
          accessToken: user.accessToken,  // Credential authorize have accessToken field
          expiredAt: user.expiredAt
        };
      }
      return token; 
    },
    session: async ({ session, token }) => {
      if (token && session) {
        session.user = token.user
        session.accessToken = token.accessToken;
        session.isExpired = token.expiredAt * 1000 < Date.now()  // Expired session handled on client side
      }
      console.log(session);
      return session;
    },
  }
})

export { handler as GET, handler as POST }