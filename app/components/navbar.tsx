import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import SignOutButton from "../signOutButton";
import SignInButton from "../signInButton";

export default async function Navbar(): Promise<JSX.Element> {
     let serverSession = await getServerSession(authOptions);

     const signInOut = serverSession?.user ? <SignOutButton /> : <SignInButton />;
     const loggedInUser = serverSession?.user ? <Link href="/user">{serverSession.user.firstName}</Link> : null;

     return (
          <nav className="flex h-14 flex-row items-center justify-between bg-slate-600 pl-4 pr-4 text-white">
               <ul className="flex list-none flex-row gap-3">
                    <li>
                         <Link href={"/"}>Auton kululoki</Link>
                    </li>
                    <li>
                         <Link href={"/cars"}>Autot</Link>
                    </li>
                    <li>
                         <Link href={"/history"}>Historia</Link>
                    </li>
               </ul>
               <div className="flex flex-row-reverse gap-2">
                    {signInOut}
                    {loggedInUser}
               </div>
          </nav>
     );
}
