import NextAuth, { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
     /**
      * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
      */
     interface Session {
          error?: string | null;
          user: {
               _id: string | null;
               aadUsername: string | null;
               firstName: string | null;
               lastName: string | null;
               initials: string | null;
          } & DefaultSession["user"];
     }

     interface Account {
          provider?: string | null;
          type?: string | null;
          providerAccountId?: string | null;
          token_type?: string | null;
          scope?: string | null;
          expires_at?: number | null;
          ext_expires_in?: number | null;
          access_token?: string | null;
          id_token?: string | null;
          session_state?: string | null;
     }

     interface Profile {
          aud?: string | null;
          iss?: string | null;
          iat?: number | null;
          nbf?: number | null;
          exp?: number | null;
          email?: string | null;
          idp?: string | null;
          name?: string | null;
          oid?: string | null;
          preferred_username?: string | null;
          rh?: string | null;
          sub?: string | null;
          tid?: string | null;
          uti?: string | null;
          ver?: string | null;
     }
}

declare module "next-auth/jwt" {
     interface JWT {
          _id: string | null;
          name?: string | null;
          firstName: string | null;
          lastName: string | null;
          initials: string | null;
          email?: string | null;
          picture?: string | null;
          sub?: string | null;
          aadObjectId?: string | null;
          aadUsername?: string | null;
          accessToken: string;
          accessTokenExpires: number;
          refreshToken: string;
          registeredUser: boolean;
          error?: string | null;
     }
}
