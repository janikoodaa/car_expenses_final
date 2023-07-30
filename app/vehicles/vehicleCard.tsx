import { GrStatusGoodSmall } from "react-icons/gr";
import Image from "next/image";
import Link from "next/link";
import { VehicleWithTypes } from "../library/models/Vehicle";
import selectPlaceholderImage from "../library/utils/selectPlaceholderImage";

export async function VehicleCard({ vehicle }: { vehicle: VehicleWithTypes }): Promise<JSX.Element> {
     let header = `${vehicle.registerNumberPlain}, ${vehicle.make} ${vehicle.model}`;
     if (vehicle.nickName) {
          header = vehicle.nickName;
     } else if (vehicle.registerNumberPlain) {
          header = `${vehicle.registerNumberPlain}, ${vehicle.make} ${vehicle.model}`.substring(0, 20);
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
                         className="flex h-4/5 justify-center"
                         href={`/vehicles/${vehicle._id}`}
                    >
                         {vehicle.imageUrl ? (
                              <Image
                                   src={encodeURI(vehicle.imageUrl)}
                                   alt={`${vehicle.make} ${vehicle.model}`}
                                   width={500}
                                   height={500}
                                   style={{ maxHeight: "100%", width: "auto" }}
                                   // placeholder="blur"
                                   // blurDataURL={`@/public/images/placeholderImageType${vehicle.type}.png`}
                                   priority
                              />
                         ) : (
                              <Image
                                   src={selectPlaceholderImage(vehicle.typeId.type)}
                                   alt={`${vehicle.make} ${vehicle.model}`}
                                   width={500}
                                   height={500}
                                   style={{ maxHeight: "100%", width: "auto" }}
                                   priority
                              />
                         )}
                    </Link>
               </div>
          </div>
     );
}
