import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { getRetiredVehiclesForUser } from "../library/mongoDB/vehicleData";
import { VehicleCard } from "./vehicleCard";
import IDataResponse from "@/types/dataResponse";
import { VehicleWithTypes } from "../library/models/Vehicle";

/**
 * Section containing cards of vehicles the logged in user has owned or has had right to use
 */
export default async function RetiredVehiclesSection(): Promise<JSX.Element | null> {
     // Check that there's valid session before further actions
     const session = await getServerSession(authOptions);
     if (!session) return null;

     const retiredVehicles: IDataResponse<VehicleWithTypes[]> = await getRetiredVehiclesForUser(session.user.aadObjectId!);
     // console.log("retiredVehicles: ", retiredVehicles);

     if (retiredVehicles.data?.length === 0) return null;
     return (
          <div className="mx-2 my-2 rounded-lg bg-slate-400 px-2 py-2">
               <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                    <h2 className="col-span-1 grid py-1 font-bold sm:col-span-2 md:col-span-3">Käytöstä poistetut ajoneuvot</h2>
                    {retiredVehicles.data
                         ? retiredVehicles.data?.map((v: VehicleWithTypes) => {
                                return (
                                     <VehicleCard
                                          key={v._id?.toString()}
                                          vehicle={v}
                                     />
                                );
                           })
                         : null}
               </div>
          </div>
     );
}
