import { Client } from "@microsoft/microsoft-graph-client";
import { Profile, Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import sql from "mssql";
import AzureADProvider from "next-auth/providers/azure-ad";
import { sqlConfig } from "./azureSQLConfiguration";

export const authOptions = {
     providers: [
          AzureADProvider({
               clientId: process.env.AZURE_AD_CLIENT_ID!,
               clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
               tenantId: process.env.AZURE_AD_TENANT_ID!,
               authorization: {
                    params: {
                         // To get the refresh_token alongside the account, the "offline_access" scope must be defined.
                         scope: "offline_access openid profile email User.Read User.Read.All",
                    },
               },
          }),
     ],
     callbacks: {
          async jwt({ token, profile, account }: { token: JWT; profile?: Profile | undefined; account?: Account | null }): Promise<JWT> {
               // console.log("account: ", account);
               if (profile && account) {
                    token.aadObjectId = profile.oid;
                    token.aadUsername = profile.preferred_username;
                    token.accessToken = account.access_token!;
                    token.accessTokenExpires = account.expires_at!;
                    token.refreshToken = account.refresh_token!;
               }
               return refreshAccessToken(token);
          },
          async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
               if (token.accessToken) {
                    const userFromGraph: UserFromGraph | undefined = await getUserFromGraph(token.accessToken);
                    if (userFromGraph?.givenName && userFromGraph?.surname) {
                         session.user.firstName = userFromGraph.givenName;
                         session.user.lastName = userFromGraph.surname;
                         session.user.initials = userFromGraph.givenName.substring(0, 1) + userFromGraph.surname.substring(0, 1);
                    }
               }

               if (token.aadObjectId) {
                    session.user.isExistingUser = await checkIfUserExists(token.aadObjectId);
                    ///todo: Jos edellinen false, luo käyttäjä kantaan ja palauta sitten sessioon true
                    ///todo: try-catchit olis kivat, niin voisi palauttaa sessioon oikean errorin, jos vaikka accestoken on vanhentunut
               }

               session.user.aadUsername = token.aadUsername!;
               session.error = token.error;
               return session;
          },
     },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
     // Refresh accessToken only only if it's expired
     if (token.accessTokenExpires * 1000 <= Date.now()) {
          try {
               const url = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
               const response = await fetch(url, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body:
                         `grant_type=refresh_token` +
                         `&client_secret=${process.env.AZURE_AD_CLIENT_SECRET}` +
                         `&refresh_token=${token.refreshToken}` +
                         `&client_id=${process.env.AZURE_AD_CLIENT_ID}`,
               });

               const newTokens = await response.json();

               return {
                    ...token,
                    accessToken: newTokens.access_token,
                    accessTokenExpires: Date.now() + newTokens.expires_in * 1000, //expires_in is token lifetime in seconds from issuance
                    refreshToken: newTokens.refresh_token ?? token.refreshToken, // Fall backto old refresh token
               };
          } catch (error) {
               console.error(error);

               return {
                    ...token,
                    error: "RefreshAccessTokenError",
               };
          }
     }
     return token;
}

async function getUserFromGraph(accessToken: string): Promise<UserFromGraph | undefined> {
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });
          const rawUserFromGraph: {} | undefined = await client.api("/me").get();
          // console.log("userFromGraph: ", rawUserFromGraph);
          const userFromGraph: UserFromGraph | undefined = rawUserFromGraph;
          return userFromGraph;
     } catch (error) {
          console.error("Error getting user info from Graph!");
          return undefined;
     }
}

async function checkIfUserExists(aadObjectId: string): Promise<boolean | undefined> {
     try {
          await sql.connect(sqlConfig);
          const usersFound = (await sql.query(`select count(1) user_count from CarExpenses.[User] where AzureAdId = '${aadObjectId}'`)).recordset;
          return usersFound[0].user_count === 1;
     } catch (error) {
          console.error("Error while connecting to database. ", error);
          return undefined;
     }
}
