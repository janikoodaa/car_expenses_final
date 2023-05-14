"use client";
import { useSession } from "next-auth/react";
import SignInButton from "./signInButton";
import SignOutButton from "./signOutButton";

export default function User(): JSX.Element | null {
     const session = useSession();
     if (session.status === "unauthenticated")
          return (
               <div className="text-center">
                    <SignInButton />
               </div>
          );
     if (session.status === "authenticated")
          return (
               <>
                    <div className="text-center">
                         <p>Kirjautuneena {session.data?.user?.name}</p>
                    </div>
                    <div className="text-center">
                         <SignOutButton />
                    </div>
               </>
          );
     return null;
}
