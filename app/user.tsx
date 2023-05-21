"use client";
import { useSession } from "next-auth/react";
import SignInButton from "./signInButton";
import SignOutButton from "./signOutButton";
import { useEffect } from "react";

export default function User(): JSX.Element | null {
     const { data: session, status } = useSession();

     useEffect(() => {
          let controller = new AbortController();
          let signal = controller.signal;

          console.log("Session data: ", session);

          return () => {
               controller.abort();
          };
     }, [session]);

     if (status === "unauthenticated")
          return (
               <div className="text-center">
                    <SignInButton />
               </div>
          );
     if (status === "authenticated")
          return (
               <>
                    <div className="text-center">
                         <p>Kirjautuneena {session.user?.name}</p>
                    </div>
                    <div className="text-center">
                         <SignOutButton />
                    </div>
               </>
          );
     return null;
}
