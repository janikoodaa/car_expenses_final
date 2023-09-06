import { getServerSession } from "next-auth";
import { VehicleWithTypes } from "./library/models/Vehicle";
import AddNewEvent from "./library/uiComponents/addNewEventButton";
import { authOptions } from "./configuration/authOptions";
import IDataResponse from "@/types/dataResponse";
import {
     getActiveVehiclesForUser,
     // getGrantedVehiclesForUser,
     // getOwnedVehiclesForUser,
     // getRefuelableVehiclesForUser,
} from "./library/mongoDB/vehicleData";
import { getEventTypes } from "./library/mongoDB/eventTypeData";
import { EventType } from "./library/models/EventType";

export default async function HomePage(): Promise<JSX.Element> {
     const session = await getServerSession(authOptions);

     // Check that there's valid session before further actions
     if (!session) return <div>Forbidden</div>;

     // const activeVehiclesPromise: Promise<IDataResponse<VehicleWithTypes[]>> = getActiveVehiclesForUser(session.user.aadObjectId!);
     // const eventTypesPromise: Promise<IDataResponse<EventType[]>> = getEventTypes();
     // const resolvedPromises: IDataResponse<VehicleWithTypes[] | EventType[]>[] = await Promise.all([
     //      activeVehiclesPromise,
     //      eventTypesPromise
     // ]);
     const activeVehicles: IDataResponse<VehicleWithTypes[]> = await getActiveVehiclesForUser(session.user.aadObjectId!);
     const eventTypes: IDataResponse<EventType[]> = await getEventTypes();
     // const availableVehicles: VehicleWithTypes[] = ownedVehicles.data
     //      ? ownedVehicles.data.concat(privilegedVehicles.data ? privilegedVehicles.data : [])
     //      : [];

     return (
          <>
               <div className="mt-4 flex columns-1 flex-col items-center gap-4">
                    <p className="">Tästä tulee sovellus, jolla voi seurata auton kuluja ja ennustaa tulevia kuluja.</p>
               </div>
               <AddNewEvent
                    vehicles={JSON.stringify(activeVehicles.data)}
                    eventTypes={JSON.stringify(eventTypes.data)}
               />
          </>
     );
}
