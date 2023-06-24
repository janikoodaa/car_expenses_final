import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../configuration/authOptions";
import SignOutButton from "./signOutButton";
import SignInButton from "./signInButton";

const protectedLinks = [
     { path: "/vehicles", description: "Ajoneuvot" },
     { path: "/history", description: "Historia" },
];

export default async function Navbar(): Promise<JSX.Element> {
     let session = await getServerSession(authOptions);
     console.log("serverSession in UserInfo: ", session);

     let linksForSignedInUsers: JSX.Element[] | null = null;
     if (session) {
          linksForSignedInUsers = protectedLinks.map((l, idx) => {
               return (
                    <li
                         key={idx}
                         className="flex h-full items-center"
                    >
                         <Link href={l.path}>{l.description}</Link>
                    </li>
               );
          });
     }

     const signInOut: JSX.Element = session ? <SignOutButton /> : <SignInButton />;
     const loggedInUser: JSX.Element | null = session ? <Link href="/user">{session.user.firstName}</Link> : null;

     return (
          <nav className="flex h-14 flex-row justify-between bg-slate-600 pl-4 pr-4 text-white">
               <ul className="flex h-full list-none flex-row gap-3">
                    <li className="flex h-full items-center">
                         <Link
                              href={"/"}
                              className="text-xl font-bold"
                         >
                              Auton kululoki
                         </Link>
                    </li>
                    {linksForSignedInUsers}
               </ul>
               <div className="flex flex-row items-center gap-2">
                    {loggedInUser}
                    {signInOut}
               </div>
          </nav>
     );
}
