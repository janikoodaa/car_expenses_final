import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { GetOwnedVehiclesForUser } from "../lib/mongoDB/vehicleData";

export default async function User(): Promise<JSX.Element> {
     const session = await getServerSession(authOptions);

     // Check that there's valid session before further actions
     if (!session) return <div>Forbidden</div>;

     const usersVehicles: DataResponse<Vehicle[]> = await GetOwnedVehiclesForUser(session?.user._id!);
     console.log("UsersVehicles: ", usersVehicles);

     let ownedVehicles;
     if (usersVehicles.data?.length) {
          ownedVehicles = usersVehicles.data.map((v) => {
               return (
                    <li key={v._id.toString()}>
                         {v.make}, {v.model}, {v.year}
                    </li>
               );
          });
     }

     let vehiclesInUse;
     if (usersVehicles.data?.length) {
          vehiclesInUse = usersVehicles.data.map((v) => {
               return (
                    <li key={v._id.toString()}>
                         {v.make}, {v.model}, {v.year}
                    </li>
               );
          });
     }

     return (
          <>
               <div className="mt-4 flex w-full columns-1 flex-col items-center gap-4">
                    <h2 className="">Täältä löytyy käyttäjän perustiedot.</h2>
                    <ul className="">
                         <li>Etunimi: {session.user.firstName}</li>
                         <li>Sukunimi: {session.user.lastName}</li>
                         <li>Nimikirjaimet: {session.user.initials}</li>
                         <li>Sähköposti: {session.user.email}</li>
                    </ul>
                    <br />
                    <h2>Käyttäjän omistamat autot</h2>
                    <ul>{ownedVehicles}</ul>
                    <br />
                    <h2>Käyttäjän käytössä olevat autot</h2>
                    <ul>{vehiclesInUse}</ul>
               </div>
          </>
     );
}
