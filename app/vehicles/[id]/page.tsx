import { authOptions } from "@/app/configuration/authOptions";
import { getVehicleById } from "@/app/library/mongoDB/vehicleData";
import { getServerSession } from "next-auth";

export default async function SingleVehiclePage({ params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     const vehicleId = params.id;
     if (!session) return null;

     const response: IDataResponse<IVehicle> = await getVehicleById(vehicleId, session.user._id!);
     //  console.log("vehicle page response: ", response.data);

     if (response.status === "ok" && response.data) {
          const vehicle = response.data;
          return (
               <div>
                    <h1>Auton tiedot</h1>
                    <p>Merkki: {vehicle.make}</p>
                    <p>Malli: {vehicle.model}</p>
                    <p>Vuosimalli: {vehicle.year}</p>
                    <p>Käytössä alkaen: {vehicle.inUseFrom.toLocaleDateString("fi")}</p>
                    <p>Polttoaine: {vehicle.primaryFuel}</p>
                    <p>Rekisteritunnus: {vehicle.registerNumber}</p>
                    <p>Rekisteröintipäivä: {vehicle.registeringDate.toLocaleDateString("fi")}</p>
                    <p>
                         Omistaja: {vehicle.owner[0].givenName} {vehicle.owner[0].surname}
                    </p>
                    <p>Omistajan sähköposti: {vehicle.owner[0].aadUsername}</p>
               </div>
          );
     }

     return <div>Virhe</div>;
}
