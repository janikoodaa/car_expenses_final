import { DateTime } from "luxon";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";

const START_YEAR = 2023;

function LinkContent() {
     return (
          <div className="flex flex-row items-center">
               &copy;
               {`${START_YEAR}
               ${DateTime.utc().year <= START_YEAR ? "" : `- ${DateTime.utc().year.toString()}`} Janikoodaa @`}
               <AiFillGithub className="ml-1 text-xl" />
          </div>
     );
}

export default function Footer() {
     return (
          <footer className="absolute bottom-0 w-full">
               <div className="flex h-10 w-full flex-row items-center justify-center">
                    <Link
                         href={"https://github.com/janikoodaa"}
                         rel="noopener noreferrer"
                         target="_blank"
                    >
                         <LinkContent />
                    </Link>
               </div>
          </footer>
     );
}
