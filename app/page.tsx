import { authOptions } from "./configuration/authOptions";
import { getServerSession } from "next-auth/next";
import SignInButton from "./signInButton";
import SignOutButton from "./signOutButton";

export default async function Home(): Promise<JSX.Element> {
     const session = await getServerSession(authOptions);
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <p className="text-center text-blue-700">Tästä tulee sovellus, jolla voi seurata auton kuluja ja ennustaa tulevia kuluja.</p>
               <div className="text-center">{session ? <p>Kirjautuneena {session.user?.name}</p> : <SignInButton />}</div>
               <div className="text-center">{session ? <SignOutButton /> : null}</div>
          </div>
     );
}
