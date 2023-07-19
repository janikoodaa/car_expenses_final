import IDataResponse from "@/types/dataResponse";
import { Client } from "@microsoft/microsoft-graph-client";
import { IAppUser } from "../models/User";
import { DateTime } from "luxon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/configuration/authOptions";

/**
 * Get user data from MS Graph API with user's access token
 * @param accessToken
 * @returns user with MS Graph data
 */
export async function getUserFromGraph(accessToken: string): Promise<IDataResponse<IAppUser>> {
     console.log(`${DateTime.now().toISO()}, getUserFromGraph() with accessToken=${accessToken}`);
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });
          const userFromGraph: IAppUser = await client.api("/me").get();
          console.log(`${DateTime.now().toISO()}, returning from getUserFromGraph() - success`);
          return { status: "ok", data: userFromGraph };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getUserFromGraph(), message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get any app user from MS Graph by user's object ID
 * @param id
 * @returns Dataresponse with User as data
 */
export async function getUserFromGraphById(id: string): Promise<IDataResponse<IAppUser>> {
     const session = await getServerSession(authOptions);
     console.log(`${DateTime.now().toISO()}, getUserFromGraphById() with id=${id}`);
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, session?.accessToken!);
               },
          });
          const userFromGraph: IAppUser = await client.api(`/users/${id}`).get();
          // console.log(`${DateTime.now().toISO()}, returning from getUserFromGraphById() - success. ${JSON.stringify(userFromGraph)}`);
          console.log(`${DateTime.now().toISO()}, returning from getUserFromGraphById() - success`);

          return { status: "ok", data: userFromGraph };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getUserFromGraphById(), message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}
