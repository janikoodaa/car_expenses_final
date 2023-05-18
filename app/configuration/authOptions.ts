import { AadProfile, ExtendedJWT } from "@/apptypes";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions = {
     providers: [
          AzureADProvider({
               clientId: process.env.AZURE_AD_CLIENT_ID!,
               clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
               tenantId: process.env.AZURE_AD_TENANT_ID!,
          }),
     ],
     callbacks: {
          // async jwt({ token, account, profile, user }: { token: any; account: any; profile: any; user: any }) {
          //      console.log("account: ", account);
          //      console.log("profile: ", profile);
          //      console.log("user: ", user);
          async jwt({ token, profile }: { token: ExtendedJWT; profile: AadProfile }) {
               if (profile) {
                    console.log("profile: ", profile);
                    token.aadObjectId = profile.oid;
               }
               return token;
          },
     },
};
