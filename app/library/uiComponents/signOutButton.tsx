"use client";
import { signOut } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";

export default function SignOutButton(): JSX.Element {
     return (
          <button
               className=" text-white"
               onClick={() => signOut({ callbackUrl: "/" })}
          >
               <BiLogOut className="-scale-x-100 transform text-xl" />
          </button>
     );
}
