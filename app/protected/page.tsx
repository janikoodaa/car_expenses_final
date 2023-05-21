import Link from "next/link";
export default function ProtectedPage(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <h2 className="text-center">Tämä on suojattu sivu.</h2>
               <Link
                    href={"/"}
                    className="text-center"
               >
                    Etusivulle
               </Link>
               <Link
                    href={"/protected/protected-sub-page"}
                    className="text-center"
               >
                    Suojatulle alasivulle
               </Link>
          </div>
     );
}
