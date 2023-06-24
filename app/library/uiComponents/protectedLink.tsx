import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";

export default async function ProtectedLink(): Promise<JSX.Element | null> {
     const session = await getServerSession(authOptions);

     if (!session) return null;
     return (
          <Link
               href={"/protected"}
               className="text-center"
          >
               Suojatulle sivulle
          </Link>
     );
}
