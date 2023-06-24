import { getServerSession } from "next-auth";
import { authOptions } from "../../configuration/authOptions";
import { getOwnedVehiclesForUser } from "../mongoDB/vehicleData";
import { FaPlus } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { OpenVehicleModalButton } from "./vehicleModal";
import Image from "next/image";

export default async function OwnedVehiclesSection(): Promise<JSX.Element | null> {
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
                         <VehicleCardFront
                              key={v._id}
                              vehicle={v}
                         />
                    );
               })}
               <AddVehicleCard />
          </div>
     );
}

async function VehicleCardFront({ vehicle }: { vehicle: Vehicle }): Promise<JSX.Element> {
     return (
          <div className="relative flex flex-col rounded-md border-2 border-slate-200 bg-slate-300">
               <h2 className="h-10 w-full pt-2 text-center font-bold">
                    {vehicle.make} {vehicle.model}, {vehicle.registerNumber}
               </h2>
               <h6 className="text-center text-xs">vm.{vehicle.year}, ml.viimeisimmän tankkauksen km</h6>
               <GrStatusGoodSmall className={"absolute right-1 top-1" + (vehicle.active ? " text-green-500" : " text-gray-500")} />
               <div className="relative flex h-full w-full justify-center">
                    <div className="absolute bottom-0 mb-4 h-4/5 w-3/4">
                         <Image
                              src={encodeURI(vehicle.image)}
                              alt="Kuva"
                              fill
                              style={{ objectFit: "contain" }}
                              sizes="20vw"
                              priority
                         />
                    </div>
               </div>
               <OpenVehicleModalButton />
          </div>
     );
}

function AddVehicleCard() {
     return (
          <div className="col-span-1 grid h-52 w-full items-center justify-center rounded-md border-2 border-slate-200 bg-slate-300">
               <h2 className="font-bold">
                    <FaPlus />
               </h2>
          </div>
     );
}
