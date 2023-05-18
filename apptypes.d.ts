import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
     aadObjectId?: string | null;
}

interface AadProfile {
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
