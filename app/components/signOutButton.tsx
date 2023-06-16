"use client";
import { signOut } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";

export default function SignOutButton(): JSX.Element {
     return (
          // <button
          //      className="rounded-md border-2 border-sky-500 bg-sky-400 p-2 text-white"
          //      onClick={() => signOut()}
          // >
          //      Kirjaudu ulos
          // </button>
          <button
               className=" text-white"
               onClick={() => signOut()}
          >
               <BiLogOut className="-scale-x-100 transform text-xl" />
          </button>
     );
}
