import User from "./user";
import ProtectedLink from "./protectedLink";
import UserInfo from "./components/userInfo";

export default function Home(): JSX.Element {
     return (
          <div className="mt-4 flex columns-1 flex-col gap-4">
               <p className="text-center text-blue-700">Tästä tulee sovellus, jolla voi seurata auton kuluja ja ennustaa tulevia kuluja.</p>
               <User />
               {/* <ProtectedLink /> */}
               {/* <UserInfo /> */}
          </div>
     );
}
