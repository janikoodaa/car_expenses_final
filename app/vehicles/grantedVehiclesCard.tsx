import { getServerSession } from "next-auth";
import { authOptions } from "../configuration/authOptions";
import { getGrantedVehiclesForUser } from "../library/mongoDB/vehicleData";
import { VehicleCard } from "./vehicleCard";
import IDataResponse from "@/types/dataResponse";
import { IVehicle } from "../library/models/Vehicle";

/**
 * Section containing cards of vehicles the logged in user has right to use
 */
export default async function GrantedVehiclesSection(): Promise<JSX.Element | null> {
     // Check that there's valid session before further actions
     const session = await getServerSession(authOptions);
     if (!session) return null;

     const grantedVehicles: IDataResponse<IVehicle[]> = await getGrantedVehiclesForUser(session.user.aadObjectId!);
     // console.log("ownedVehicles: ", ownedVehicles);

     if (grantedVehicles.data?.length === 0) return null;
     return (
          <div className="mx-2 my-2 rounded-lg bg-slate-400 px-2 py-2">
               <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                    <h2 className="col-span-1 grid py-1 font-bold sm:col-span-2 md:col-span-3">Muut käytössäsi olevat ajoneuvot</h2>
                    {grantedVehicles.data?.map((v: IVehicle) => {
                         return (
                              <VehicleCard
                                   key={v._id?.toString()}
                                   vehicle={v}
                              />
                         );
                    })}
               </div>
          </div>
     );
}
