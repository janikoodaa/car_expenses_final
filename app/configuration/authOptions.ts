import { Profile, Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getUser, SaveNewUser, UpdateUser } from "../lib/mongoDB/userData";
import { getUserFromGraph } from "../lib/msGraph/getUserFromGraph";

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
               // console.log("Entering async jwt()...");
               // console.log("token in async jwt: ", token);
               // console.log("token expires: ", new Date(token.accessTokenExpires));
               // console.log("token error in async jwt: ", token.error);
               // console.log("account: ", account);
               // if (token) console.log("token exists in async jwt(), ", token);

               if (profile && account) {
                    const graphData: GraphResponse = await getUserFromGraph(account.access_token!);
                    if (graphData.status === "ok") {
                         const userFromGraph: UserFromGraph = graphData.data!;
                         token.firstName = userFromGraph.givenName!;
                         token.lastName = userFromGraph.surname!;
                         token.initials = userFromGraph.givenName!.substring(0, 1) + userFromGraph.surname!.substring(0, 1);
                    } else {
                         console.error("Error getting user data from Graph. ", graphData.error);
                         token.firstName = null;
                         token.lastName = null;
                         token.initials = null;
                         token.error = "Error getting user data from Graph.";
                    }

                    const foundUser: UserResponse = await getUser(profile.oid!);
                    console.log("Found User: ", foundUser);

                    let userIdInApp = foundUser.data?._id;

                    if (foundUser.status === "error") {
                         console.error(`Error getting user with aadObjectId ${profile.oid}. Error: ${foundUser.error}`);
                         token.error = foundUser.error;
                    }

                    if (foundUser.status === "ok" && !foundUser.data) {
                         const saveResult: UserResponse = await SaveNewUser({ aadObjectId: profile.oid!, aadUsername: profile.preferred_username! });

                         userIdInApp = saveResult.data?._id;

                         if (saveResult.status === "error") {
                              console.error("Saving new user failed. ", saveResult.error);
                              token.error += " Saving new user failed.";
                         }
                    } else if (foundUser.status === "ok" && foundUser.data?.aadUsername !== profile.preferred_username) {
                         // console.log("Need to update the user's email.");
                         const updateResult: UserResponse = await UpdateUser({
                              _id: foundUser.data?._id,
                              aadObjectId: profile.oid!,
                              aadUsername: profile.preferred_username!,
                         });
                         if (updateResult.status === "error") {
                              // console.error("Updating user data failed. ", updateResult.error);
                              token.error += " Updating user data failed.";
                         }
                    }

                    token._id = userIdInApp;
                    token.aadObjectId = profile.oid;
                    token.aadUsername = profile.preferred_username;
                    token.accessToken = account.access_token!;
                    token.accessTokenExpires = account.expires_at!;
                    token.refreshToken = account.refresh_token!;
               }

               // console.log("JWT token: ", token);
               // console.log("Exiting async jwt()...");
               return refreshAccessToken(token);
          },
          async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
               // console.log("Setting data from token to session.");

               session.user._id = token._id;
               session.user.firstName = token.firstName;
               session.user.lastName = token.lastName;
               session.user.initials = token.initials;
               session.user.aadUsername = token.aadUsername!;
               session.error = token.error;

               return session;
          },
     },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
     // Refresh accessToken only only if it's expired
     if (new Date(token.accessTokenExpires) <= new Date()) {
          // console.log("trying to refresh the accesstoken");
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
               // console.log("new token in refreshing accesstoken: ", newTokens);
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
