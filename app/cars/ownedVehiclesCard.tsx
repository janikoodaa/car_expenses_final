import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { getOwnedVehiclesForUser } from "../lib/mongoDB/vehicleData";
import { FaPlus } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import Image from "next/image";

export default async function OwnedVehiclesCard(): Promise<JSX.Element | null> {
     // Check that there's valid session before further actions
     const session = await getServerSession(authOptions);
     if (!session) return null;

     const ownedVehicles: DataResponse<Vehicle[]> = await getOwnedVehiclesForUser(session.user._id!);

     if (!ownedVehicles.data) return null;

     return (
          <div className="grid grid-cols-3 gap-x-4">
               <h2 className="col-span-3 mb-4 grid font-bold">Omistamasi ajoneuvot</h2>
               {ownedVehicles.data.map((v: Vehicle) => {
                    return (
                         <VehicleCard
                              key={v._id}
                              vehicle={v}
                         />
                    );
               })}
               <AddVehicleCard />
          </div>
     );
}

async function VehicleCard({ vehicle }: { vehicle: Vehicle }): Promise<JSX.Element> {
     return (
          <div className="relative col-span-1 grid justify-center rounded-md border-2 border-slate-200 bg-slate-300">
               <h2 className="font-bold">
                    {vehicle.model} {vehicle.year}, "{vehicle.nickName}"
               </h2>
               <GrStatusGoodSmall className={"absolute right-1 top-1" + (vehicle.active ? " text-green-500" : " text-gray-500")} />
               <Image
                    src={encodeURI(vehicle.image)}
                    alt="Kuva"
                    width={250}
                    height={150}
               />
          </div>
     );
}

function AddVehicleCard() {
     return (
          <div className="col-span-1 grid h-32 items-center justify-center rounded-md border-2 border-slate-200 bg-slate-300">
               <h2 className="font-bold">
                    <FaPlus />
               </h2>
          </div>
     );
}
