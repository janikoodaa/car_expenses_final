import User from "./user";

export default function Home(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <p className="text-center text-blue-700">Tästä tulee sovellus, jolla voi seurata auton kuluja ja ennustaa tulevia kuluja.</p>
               <User />
          </div>
     );
}