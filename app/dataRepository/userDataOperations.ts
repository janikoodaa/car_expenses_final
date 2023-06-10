import { Client } from "@microsoft/microsoft-graph-client";
import sql from "mssql";
import { sqlConfig } from "../configuration/azureSQLConfiguration";

export async function getUserFromGraph(accessToken: string): Promise<GraphResponse> {
     let user: GraphResponse;
     try {
          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });
          const userFromGraph: UserFromGraph = await client.api("/me").get();
          user = { status: "ok", data: userFromGraph };
          return user;
     } catch (error: any) {
          return (user = { status: "error", data: null, error: error });
     }
}

export async function checkIfUserExists(aadObjectId: string): Promise<UserCheckResponse> {
     let checkResult: UserCheckResponse;
     try {
          await sql.connect(sqlConfig);
          const usersFound = (await sql.query(`select count(1) user_count from CarExpenses.[User] where AzureAdId = '${aadObjectId}'`)).recordset;
          // console.log(`Found ${usersFound[0].user_count} users matching Azure oid ${aadObjectId}`);
          checkResult = { status: "ok", data: { isExistingUser: usersFound[0].user_count === 1 } };
          return checkResult;
     } catch (error: any) {
          return (checkResult = { status: "error", data: null, error: error });
     }
}

export async function SaveNewUser(aadObjectId: string): Promise<DataResponse> {
     // console.log("Starting to save user");
     let saveResponse: DataResponse;
     try {
          const pool = await sql.connect(sqlConfig);
          const result = await pool
               .request()
               .input("AzureAdId", sql.VarChar(50), aadObjectId)
               .output("NewUserId", sql.Int())
               .execute("CarExpenses.InsertNewUser");
          // console.log("New user id: ", result.output.NewUserId);
          return (saveResponse = { status: "ok", data: null });
     } catch (error: any) {
          // console.error("Error inserting new user. ", error);
          return (saveResponse = { status: "error", data: null, error: error });
     }
}
