"use client"; // Error components must be Client Components

import { useEffect } from "react";
import SignOutButton from "./library/uiComponents/signOutButton";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
     useEffect(() => {
          // Log the error to an error reporting service
          console.error("Catch error: ", error);
     }, [error]);

     if (error.message === "MultipleUsersWithSameId") {
          console.log("Catch error in if: ", error.message);
          return (
               <div>
                    <h2>Samalla käyttäjätunnuksella löytyy monta tiliä.</h2>
                    <SignOutButton />
               </div>
          );
     }

     return (
          <div>
               <h2>Something went wrong!</h2>
               <button
                    onClick={
                         // Attempt to recover by trying to re-render the segment
                         () => reset()
                    }
               >
                    Try again
               </button>
          </div>
     );
}
