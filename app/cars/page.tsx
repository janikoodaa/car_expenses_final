import Link from "next/link";
export default function Cars(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <h2 className="text-center">Tänne tulee listaus käyttäjän autoista.</h2>
               <Link
                    href={"/"}
                    className="text-center"
               >
                    Etusivulle
               </Link>
          </div>
     );
}
