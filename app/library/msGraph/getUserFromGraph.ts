import { Client } from "@microsoft/microsoft-graph-client";

export async function getUserFromGraph(accessToken: string): Promise<IDataResponse<Partial<IAppUser>>> {
     let user: IDataResponse<Partial<IAppUser>>;
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });
          const userFromGraph: Partial<IAppUser> = await client.api("/me").get();
          user = { status: "ok", data: userFromGraph };
          return user;
     } catch (error: any) {
          return (user = { status: "error", data: null, error: error });
     }
}
