"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProtectedLink(): JSX.Element | null {
     const session = useSession();
     if (session.status === "authenticated")
          return (
               <Link
                    href={"/protected"}
                    className="text-center"
               >
                    Suojatulle sivulle
               </Link>
          );
     return null;
}
