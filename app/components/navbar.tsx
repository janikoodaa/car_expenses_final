import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import SignOutButton from "../signOutButton";
import SignInButton from "../signInButton";

const navLinks = [
     { path: "/cars", description: "Autot" },
     { path: "/history", description: "Historia" },
];

export default async function Navbar(): Promise<JSX.Element> {
     let serverSession = await getServerSession(authOptions);
     console.log("serverSession in UserInfo: ", serverSession);

     let linksForSignedInUsers;
     if (serverSession?.user) {
          linksForSignedInUsers = navLinks.map((l) => {
               return (
                    <li className="flex h-full items-center">
                         <Link href={l.path}>{l.description}</Link>
                    </li>
               );
          });
          // <>
          //      <li className="flex h-full items-center">
          //           <Link
          //                href={"/cars"}
          //                className=""
          //           >
          //                Autot
          //           </Link>
          //      </li>
          //      <li className="flex h-full items-center">
          //           <Link href={"/history"}>Historia</Link>
          //      </li>
          // </>
     }

     // const linksForSignedInUsers = serverSession?.user ? (
     //      <>
     //           <li className="flex h-full items-center">
     //                <Link
     //                     href={"/cars"}
     //                     className=""
     //                >
     //                     Autot
     //                </Link>
     //           </li>
     //           <li className="flex h-full items-center">
     //                <Link href={"/history"}>Historia</Link>
     //           </li>
     //      </>
     // ) : null;
     const signInOut = serverSession?.user ? <SignOutButton /> : <SignInButton />;
     const loggedInUser = serverSession?.user ? <Link href="/user">{serverSession.user.firstName}</Link> : null;

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
                    {/* <li className="flex h-full items-center">
                         <Link
                              href={"/cars"}
                              className=""
                         >
                              Autot
                         </Link>
                    </li>
                    <li className="flex h-full items-center">
                         <Link href={"/history"}>Historia</Link>
                    </li> */}
               </ul>
               <div className="flex flex-row-reverse items-center gap-2">
                    {signInOut}
                    {loggedInUser}
               </div>
          </nav>
     );
}
