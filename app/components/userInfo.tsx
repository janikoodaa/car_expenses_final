import { Client } from "@microsoft/microsoft-graph-client";
import { getToken, JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { authOptions } from "../configuration/authOptions";

// async function getSession() {
//      return await getServerSession(authOptions);
// }

export default async function UserInfo(): Promise<JSX.Element> {
     //  let token: JWT | undefined = undefined; //await getToken({ req });
     //  const cookieStore = cookies();
     //  console.log("cookieStore: ", cookies().getAll());
     //  let token = await getToken({ req });
     //  console.log("token: ", token);
     //  let serverSession = await getServerSession();
     //  console.log("serverSession: ", serverSession?.accessToken);
     //  const accessToken: string | null = cookieStore.get("next-auth.session-token.0")?.value!;
     //  console.log("accessToken: ", accessToken);
     //  let response = await fetch("https://graph.microsoft.com/v1.0/me", { headers: { Authorization: `Bearer ${accessToken}` } });
     //  let userDetails = await response.json();
     //  const client = Client.init({
     //       authProvider: (done) => {
     //            done(null, accessToken);
     //       },
     //  });
     //  userDetails = await client.api("/me").get();
     //  console.log("userDetails: ", userDetails);

     //  let response = await fetch("http://localhost:3000/api/user");
     //  let user = await response.json();
     //  console.log("user in server component: ", user);

     return <p>Testi</p>;
}
