import { GrStatusGoodSmall } from "react-icons/gr";
import Image from "next/image";
import Link from "next/link";
import { IVehicle } from "../library/models/Vehicle";

export async function VehicleCard({ vehicle }: { vehicle: IVehicle }): Promise<JSX.Element> {
     let header = `${vehicle.registerNumber}, ${vehicle.make} ${vehicle.model}`;
     if (vehicle.nickName) {
          header = vehicle.nickName;
     } else if (vehicle.registerNumber) {
          header = `${vehicle.registerNumber}, ${vehicle.make} ${vehicle.model}`.substring(0, 20);
     } else {
          header = `${vehicle.make} ${vehicle.model}`.substring(0, 20);
     }
     return (
          <div className="flex h-52 flex-col rounded-md border-2 border-slate-200 bg-slate-300">
               <div className="flex flex-row">
                    <h2 className="h-10 w-full pt-2 text-center font-bold">{header}</h2>
                    <GrStatusGoodSmall className={"ml-auto mr-1 mt-1" + (vehicle.active ? " text-green-500" : " text-gray-500")} />
               </div>
               <h6 className="text-center text-xs">vm.{vehicle.year}, ml.viimeisimmän tankkauksen km</h6>
               <div className="flex h-36 w-full flex-row items-center justify-center">
                    <Link
                         className="flex h-4/5 justify-center border border-slate-400"
                         href={`/vehicles/${vehicle._id}`}
                    >
                         {vehicle.imageUrl ? (
                              <Image
                                   src={encodeURI(vehicle.imageUrl)}
                                   alt={`${vehicle.make} ${vehicle.model}`}
                                   width={500}
                                   height={500}
                                   style={{ maxHeight: "100%", width: "auto" }}
                                   placeholder="blur"
                                   blurDataURL={encodeURI(vehicle.imageUrl)}
                                   priority
                              />
                         ) : (
                              <div className="mx-4 flex h-full items-center text-slate-400">Ei kuvaa</div>
                         )}
                    </Link>
               </div>
          </div>
     );
}
