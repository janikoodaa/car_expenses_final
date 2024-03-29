import Link from "next/link";

export const metadata = {
     title: "Kul(k)upeli - historia",
     description: "Tapahtumahistoria halutulla suodatuksella.",
};

export default function HistoryPage(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4 pb-10">
               <h2 className="text-center">Tänne tulee käyttäjän kulujen historianäkymä.</h2>
               <Link
                    href={"/"}
                    className="text-center"
               >
                    Etusivulle
               </Link>
          </div>
     );
}
