import IDataResponse from "@/types/dataResponse";
import { Client } from "@microsoft/microsoft-graph-client";
import { IAppUser } from "../models/User";

/**
 * Get user data from MS Graph API with user's access token
 * @param accessToken
 * @returns user with MS Graph data
 */
export async function getUserFromGraph(accessToken: string): Promise<IDataResponse<IAppUser>> {
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });
          const userFromGraph: IAppUser = await client.api("/me").get();
          return { status: "ok", data: userFromGraph };
     } catch (error: any) {
          console.error("Error getting user data from MS Graph: ", error);
          return { status: "error", data: null, error: error };
     }
}
