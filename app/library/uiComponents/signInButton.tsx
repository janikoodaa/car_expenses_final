"use client";
import { signIn } from "next-auth/react";
import { BiLogIn } from "react-icons/bi";

export default function SignInButton(): JSX.Element {
     return (
          <button
               className=" text-xl text-white"
               onClick={() => signIn("azure-ad")}
          >
               <BiLogIn />
          </button>
     );
}
