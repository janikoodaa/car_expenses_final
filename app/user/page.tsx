import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { getOwnedVehiclesForUser, getGrantedVehiclesForUser } from "../library/mongoDB/vehicleData";
import IDataResponse from "@/types/dataResponse";
import { VehicleWithTypes } from "../library/models/Vehicle";

export const metadata = {
     title: "Kul(k)upeli - minä",
     description: "Kirjautuneen käyttäjän tiedot.",
};

export default async function User(): Promise<JSX.Element> {
     const session = await getServerSession(authOptions);

     // Check that there's valid session before further actions
     if (!session) return <div>Forbidden</div>;

     const ownedVehiclesPromise: Promise<IDataResponse<VehicleWithTypes[]>> = getOwnedVehiclesForUser(session.user.aadObjectId!);
     const privilegedVehiclesPromise: Promise<IDataResponse<VehicleWithTypes[]>> = getGrantedVehiclesForUser(session.user.aadObjectId!);
     const resolvedPromises: IDataResponse<VehicleWithTypes[]>[] = await Promise.all([ownedVehiclesPromise, privilegedVehiclesPromise]);
     const ownedVehicles: IDataResponse<VehicleWithTypes[]> = resolvedPromises[0];
     const privilegedVehicles: IDataResponse<VehicleWithTypes[]> = resolvedPromises[1];

     return (
          <div className="mt-4 flex w-full columns-1 flex-col items-center gap-4 pb-10">
               <h2 className="">Täältä löytyy käyttäjän perustiedot.</h2>
               <ul className="">
                    <li>Etunimi: {session.user.firstName}</li>
                    <li>Sukunimi: {session.user.lastName}</li>
                    <li>Nimikirjaimet: {session.user.initials}</li>
                    <li>Sähköposti: {session.user.email}</li>
                    <li>Käyttäjä ID: {session.user.aadObjectId}</li>
               </ul>
               <OwnedVehiclesList vehicles={ownedVehicles.data} />
               <PrivilegedVehiclesList vehicles={privilegedVehicles.data} />
          </div>
     );
}

function OwnedVehiclesList({ vehicles }: { vehicles: VehicleWithTypes[] | null }): JSX.Element | null {
     if (vehicles === null || !vehicles.length) return null;
     const ownedVehiclesList = vehicles.map((v) => {
          return (
               <li key={v._id!.toString()}>
                    {v.make}, {v.model}, {v.year}
               </li>
          );
     });
     return (
          <>
               <br />
               <h2>Käyttäjän omistamat ajoneuvot</h2>
               <ul>{ownedVehiclesList}</ul>
          </>
     );
}

function PrivilegedVehiclesList({ vehicles }: { vehicles: VehicleWithTypes[] | null }): JSX.Element | null {
     if (vehicles === null || !vehicles.length) return null;
     const privilegedVehiclesList = vehicles.map((v) => {
          return (
               <li key={v._id!.toString()}>
                    {v.make}, {v.model}, {v.year}
               </li>
          );
     });
     return (
          <>
               <br />
               <h2>Käyttäjän muut käytössä olevat ajoneuvot</h2>
               <ul>{privilegedVehiclesList}</ul>
          </>
     );
}
