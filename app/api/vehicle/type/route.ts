import { authOptions } from "@/app/configuration/authOptions";
import { VehicleType } from "@/app/library/models/VehicleType";
import { getActiveVehicleTypes } from "@/app/library/mongoDB/vehicleTypeData";
import IDataResponse from "@/types/dataResponse";
import { getServerSession } from "next-auth";

export async function GET(): Promise<Response> {
     try {
          const session = await getServerSession(authOptions);
          if (!session) return new Response("Sinulla ei ole vaadittavaa oikeutta!", { status: 401 });

          const dbResponse: IDataResponse<VehicleType[]> = await getActiveVehicleTypes();
          console.log("Search result in /api/vehicle/type method GET: ", dbResponse);
          if (dbResponse.status === "ok") {
               return new Response(JSON.stringify(dbResponse), { status: 200 });
          } else {
               return new Response(JSON.stringify(dbResponse), { status: 500 });
          }
     } catch (error) {
          console.error("Unknown error in api/vehicle method POST: ", error);
          const unknownError: IDataResponse<VehicleType> = {
               status: "error",
               data: null,
               error: { message: "Palvelimella tapahtui tuntematon virhe." },
          };
          return new Response(JSON.stringify(unknownError), { status: 500 });
     }
}
