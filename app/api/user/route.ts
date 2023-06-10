import { NextResponse, NextRequest } from "next/server";
// import { sqlConnection } from "@/app/configuration/dataRepository";
import { getToken, JWT } from "next-auth/jwt";
import { Client } from "@microsoft/microsoft-graph-client";

export async function GET(req: NextRequest) {
     const token: JWT | null = await getToken({ req });
     // console.log("token: ", JSON.stringify(token, null, 2));
     if (token) {
          // let sqlConn = await sqlConnection();
          // let cars = await sqlConn?.query("select * from CarExpenses.CarMain");

          const accessToken: string | null = token.accessToken!;

          const client = Client.init({
               authProvider: (done) => {
                    done(null, accessToken);
               },
          });

          const userDetails = await client.api("/me").get();
          // console.log("UserDetails: ", userDetails);

          const user = {
               firstName: userDetails.givenName,
               lastName: userDetails.surname,
               initials: userDetails?.givenName?.substring(0, 1) + userDetails?.surname?.substring(0, 1),
          };

          return NextResponse.json(user, { status: 200 });
     }
     return NextResponse.json(token, { status: 401 });
}
