import Link from "next/link";

export default function ProtectedPage(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <h2 className="text-center">Tämä on suojattu alasivu.</h2>
               <Link
                    href={"/"}
                    className="text-center"
               >
                    Etusivulle
               </Link>

               <Link
                    href={"/protected"}
                    className="text-center"
               >
                    Suojatulle sivulle
               </Link>
          </div>
     );
}
