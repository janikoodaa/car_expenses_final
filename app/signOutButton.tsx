"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton(): JSX.Element {
     return (
          <button
               className="rounded-md border-2 border-sky-500 bg-sky-400 p-2 text-white"
               onClick={() => signOut()}
          >
               Kirjaudu ulos
          </button>
     );
}
