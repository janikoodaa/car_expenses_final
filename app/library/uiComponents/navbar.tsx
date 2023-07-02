import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../../configuration/authOptions";
import SignOutButton from "./signOutButton";
import SignInButton from "./signInButton";
import SmallScreenNav from "./smallScreenNav";
import protectedLinks from "@/linksForSignedInUsers.json";

export default async function Navbar(): Promise<JSX.Element> {
     let session = await getServerSession(authOptions);
     // console.log("serverSession in Navbar: ", session);

     return (
          <nav className="min-h-full flex-row justify-between bg-slate-600 pl-4 pr-4 text-slate-100 ">
               {/** For larger screens */}
               <ul className="hidden h-14 list-none flex-row gap-3 lg:flex">
                    <li className="flex h-full items-center">
                         <Link
                              href={"/"}
                              className="text-xl font-bold"
                         >
                              Auton kululoki
                         </Link>
                    </li>
                    {!session
                         ? null
                         : protectedLinks.map((l, idx) => {
                                return (
                                     <li
                                          key={idx}
                                          className="flex h-full items-center"
                                     >
                                          <Link href={l.path}>{l.description}</Link>
                                     </li>
                                );
                           })}
                    <li className="ml-auto hidden flex-row items-center gap-2 lg:flex">
                         {session ? <Link href="/user">{session.user.firstName}</Link> : null}
                         {session ? <SignOutButton /> : <SignInButton />}
                    </li>
               </ul>
               {/** For smaller screens */}
               <SmallScreenNav />
          </nav>
     );
}
