import { getServerSession } from "next-auth";
import { authOptions } from "../../configuration/authOptions";

export default async function UserInfo(): Promise<JSX.Element | null> {
     let serverSession = await getServerSession(authOptions);
     // console.log("serverSession in UserInfo: ", serverSession);

     if (!serverSession) return null;
     if (serverSession.error) {
          throw new Error("MultipleUsersWithSameId");
     }
     return (
          <div className="text-center">
               <p>Nimikirjaimet sessiosta: {serverSession?.user.initials}</p>
          </div>
     );
}
