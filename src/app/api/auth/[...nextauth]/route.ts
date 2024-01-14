import NextAuth, { Session, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
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
        password: { label: "Password", type: "password" },
        longer: {label: "Remember me", type: "checkbox"}
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const payload = {
          username: credentials.username,
          password: credentials.password,
          longer: credentials.longer ?? false
        };

        const res = await fetch(`${process.env.NEXT_API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const txt = await res.text()
          throw new Error(txt);
        }
        const user = await res.json();
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      }
    }),
    // GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
    // })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt: async ({ token , user }: {token: JWT, user: User | AdapterUser}) => {
      if (user) {
        // This will be executed at login
        token = {
          ...token,
          user: user,
          accessToken: user.accessToken,  // Credential authorize have accessToken field
          expiredAt: user.expiredAt
        };
      }
      return token; 
    },
    session: async ({ session, token }: {session: Session, token: JWT}) => {
      if (token && session) {
        session.user = token.user
        session.accessToken = token.accessToken;
        session.isExpired = token.expiredAt * 1000 < Date.now()  // Expired session handled on client side
      }
      // console.log(session);
      return session;
    },
  },
  events: {
    signOut: async ({ session, token }: {session: Session, token: JWT}) => {
      if(token){
        await fetch(`${process.env.NEXT_API_URL}/signout`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.accessToken}`
          },
          body: JSON.stringify({all: false}),
        })
      }
    }
  }
}

// TODO: Implement OAuth
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }