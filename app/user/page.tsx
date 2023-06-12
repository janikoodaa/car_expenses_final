import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";

export default async function User(): Promise<JSX.Element> {
     const serverSession = await getServerSession(authOptions);
     return (
          <div className="mt-4 flex w-full columns-1 flex-col items-center gap-4">
               <h2 className="">Täältä löytyy käyttäjän perustiedot.</h2>
               <ul className="">
                    <li>Etunimi: {serverSession?.user.firstName}</li>
                    <li>Sukunimi: {serverSession?.user.lastName}</li>
                    <li>Nimikirjaimet: {serverSession?.user.initials}</li>
                    <li>Sähköposti: {serverSession?.user.email}</li>
               </ul>
          </div>
     );
}
