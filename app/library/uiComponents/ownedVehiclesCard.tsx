import { getServerSession } from "next-auth";
import { authOptions } from "../../configuration/authOptions";
import { getOwnedVehiclesForUser } from "../mongoDB/vehicleData";
import { GrStatusGoodSmall } from "react-icons/gr";
// import { OpenVehicleModalButton } from "./vehicleModal";
import AddVehicleCard from "./addNewVehicle";
import Image from "next/image";
import Link from "next/link";

export default async function OwnedVehiclesSection(): Promise<JSX.Element | null> {
     // Check that there's valid session before further actions
     const session = await getServerSession(authOptions);
     if (!session) return null;

     const ownedVehicles: IDataResponse<IVehicle[]> = await getOwnedVehiclesForUser(session.user._id!);

     return (
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-1 md:grid-cols-3">
               <h2 className="grid py-1 font-bold sm:col-span-1 md:col-span-3">Omistamasi ajoneuvot</h2>
               {ownedVehicles.data?.map((v: IVehicle) => {
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

async function VehicleCardFront({ vehicle }: { vehicle: IVehicle }): Promise<JSX.Element> {
     return (
          <div className="relative flex h-52 flex-col rounded-md border-2 border-slate-200 bg-slate-300">
               <h2 className="h-10 w-full pt-2 text-center font-bold">
                    {vehicle.make} {vehicle.model}, {vehicle.registerNumber}
               </h2>
               <h6 className="text-center text-xs">vm.{vehicle.year}, ml.viimeisimmän tankkauksen km</h6>
               <GrStatusGoodSmall className={"absolute right-1 top-1" + (vehicle.active ? " text-green-500" : " text-gray-500")} />
               <div className="relative flex h-full w-full justify-center">
                    <div className="absolute bottom-0 mb-4 h-4/5 w-3/4">
                         <Link
                              className="absolute h-full w-full"
                              href={`/vehicles/${vehicle._id}`}
                         >
                              <Image
                                   src={encodeURI(vehicle.image)}
                                   alt={`${vehicle.make} ${vehicle.model}`}
                                   fill
                                   style={{ objectFit: "contain" }}
                                   sizes="20vw"
                                   priority
                              />
                         </Link>
                    </div>
               </div>
          </div>
     );
}
