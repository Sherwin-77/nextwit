import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    expiredAt: number;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    accessToken: string;
    expiredAt: number;
}
interface Session {
    accessToken: string;
    isExpired: boolean;
    user: {
      
    } & DefaultSession["user"]
  }
}