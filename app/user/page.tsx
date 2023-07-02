import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { getOwnedVehiclesForUser, getGrantedVehiclesForUser } from "../library/mongoDB/vehicleData";

export default async function User(): Promise<JSX.Element> {
     const session = await getServerSession(authOptions);

     // Check that there's valid session before further actions
     if (!session) return <div>Forbidden</div>;

     const ownedVehiclesPromise: Promise<IDataResponse<IVehicle[]>> = getOwnedVehiclesForUser(session.user._id!);
     const privilegedVehiclesPromise: Promise<IDataResponse<IVehicle[]>> = getGrantedVehiclesForUser(session.user._id!);
     const resolvedPromises: IDataResponse<IVehicle[]>[] = await Promise.all([ownedVehiclesPromise, privilegedVehiclesPromise]);
     const ownedVehicles: IDataResponse<IVehicle[]> = resolvedPromises[0];
     const privilegedVehicles: IDataResponse<IVehicle[]> = resolvedPromises[1];

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
                    <OwnedVehiclesList vehicles={ownedVehicles.data} />
                    <PrivilegedVehiclesList vehicles={privilegedVehicles.data} />
               </div>
          </>
     );
}

function OwnedVehiclesList({ vehicles }: { vehicles: IVehicle[] | null | undefined }): JSX.Element | null {
     if (!vehicles || !vehicles.length) return null;
     const ownedVehiclesList = vehicles.map((v) => {
          return (
               <li key={v._id.toString()}>
                    {v.make}, {v.model}, {v.year}
               </li>
          );
     });
     return (
          <>
               <br />
               <h2>Käyttäjän omistamat autot</h2>
               <ul>{ownedVehiclesList}</ul>
          </>
     );
}

function PrivilegedVehiclesList({ vehicles }: { vehicles: IVehicle[] | null | undefined }): JSX.Element | null {
     if (!vehicles || !vehicles.length) return null;
     const privilegedVehiclesList = vehicles.map((v) => {
          return (
               <li key={v._id.toString()}>
                    {v.make}, {v.model}, {v.year}
               </li>
          );
     });
     return (
          <>
               <br />
               <h2>Käyttäjän muut käytössä olevat autot</h2>
               <ul>{privilegedVehiclesList}</ul>
          </>
     );
}
