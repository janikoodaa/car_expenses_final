"use client";
import { signIn } from "next-auth/react";

export default function SignInButton(): JSX.Element {
     return (
          <button
               className="rounded-md border-2 border-sky-500 bg-sky-400 p-2 text-white"
               onClick={() => signIn("azure-ad")}
          >
               Kirjaudu sisään Azure AD -tunnuksella
          </button>
     );
}
