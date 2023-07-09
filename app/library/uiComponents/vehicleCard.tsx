import { GrStatusGoodSmall } from "react-icons/gr";
import Image from "next/image";
import Link from "next/link";
import { IVehicleWithId } from "../mongoDB/vehicleData";

export async function VehicleCard({ vehicle }: { vehicle: IVehicleWithId }): Promise<JSX.Element> {
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
                              {vehicle.image ? (
                                   <Image
                                        src={encodeURI(vehicle.image)}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        sizes="20vw"
                                        priority
                                   />
                              ) : null}
                         </Link>
                    </div>
               </div>
          </div>
     );
}
