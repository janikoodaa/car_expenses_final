import { authOptions } from "@/app/configuration/authOptions";
import { IAppUser } from "@/app/library/models/User";
import { IVehicle } from "@/app/library/models/Vehicle";
import { getVehicleById } from "@/app/library/mongoDB/vehicleData";
import IDataResponse from "@/types/dataResponse";
import { getServerSession } from "next-auth";

export default async function SingleVehiclePage({ params }: { params: { id: string } }) {
     const session = await getServerSession(authOptions);
     const vehicleId = params.id;
     if (!session) return null;

     const response: IDataResponse<IVehicle> = await getVehicleById(vehicleId, session.user._id!);
     console.log("vehicle page response: ", response);

     if (response.status === "ok" && response.data) {
          const vehicle: IVehicle = response.data;
          const owner = response.data.owner as IAppUser;
          const coUsers = response.data.coUsers as IAppUser[];
          return (
               <div>
                    <h1>Auton tiedot</h1>
                    <p>Merkki: {vehicle.make}</p>
                    <p>Malli: {vehicle.model}</p>
                    <p>Vuosimalli: {vehicle.year}</p>
                    <p>Käytössä alkaen: {vehicle.inUseFrom.toLocaleDateString("fi")}</p>
                    <p>Polttoaine: {vehicle.primaryFuel}</p>
                    <p>Rekisteritunnus: {vehicle.registerNumber}</p>
                    <p>Rekisteröintipäivä: {vehicle.registeringDate ? vehicle.registeringDate.toLocaleDateString("fi") : "-"}</p>
                    <br />
                    <h1>Ajoneuvon omistaja</h1>
                    <p>
                         Omistaja: {owner.givenName} {owner.surname}
                    </p>
                    <p>Omistajan sähköposti: {owner.aadUsername}</p>
                    <br />
                    <h1>Ajoneuvon muut käyttäjät</h1>
                    {coUsers.map((cu, idx) => {
                         return <p key={idx}>Sähköposti: {cu.aadUsername}</p>;
                    })}
               </div>
          );
     }

     return <div>Virhe</div>;
}
