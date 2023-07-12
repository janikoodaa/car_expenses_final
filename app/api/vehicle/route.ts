import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/configuration/authOptions";
import { ObjectId } from "mongodb";
import { insertNewVehicle } from "@/app/library/mongoDB/vehicleData";
import IDataResponse from "@/types/dataResponse";
import { IVehicle } from "@/app/library/models/Vehicle";

export async function POST(request: NextRequest): Promise<Response> {
     try {
          const session = await getServerSession(authOptions);
          if (!session) return new Response("Sinulla ei ole vaadittavaa oikeutta!", { status: 401 });

          const req = await request.json();
          //   console.log("req in POST: ", req);

          const vehicleToInsert: IVehicle = {
               ...req,
               owner: new ObjectId(session.user._id!),
               inUseFrom: new Date(req.inUseFrom),
               registeringDate: new Date(req.registeringDate),
          };
          const dbResponse: IDataResponse<IVehicle> = await insertNewVehicle(vehicleToInsert);
          console.log("Insert result in api/vehicle method POST: ", dbResponse);
          if (dbResponse.status === "ok") {
               return new Response(JSON.stringify(dbResponse), { status: 201 });
          } else {
               return new Response(JSON.stringify(dbResponse), { status: 500 });
          }
     } catch (error) {
          console.error("Unknown error in api/vehicle method POST: ", error);
          const unknownError: IDataResponse<IVehicle> = {
               status: "error",
               data: null,
               error: { message: "Palvelimella tapahtui tuntematon virhe." },
          };
          return new Response(JSON.stringify(unknownError), { status: 500 });
     }
}
