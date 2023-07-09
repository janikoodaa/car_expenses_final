import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/configuration/authOptions";
import { ObjectId } from "mongodb";
import { IVehicle, IVehicleWithId, insertNewVehicle } from "@/app/library/mongoDB/vehicleData";
import IDataResponse from "@/types/dataResponse";

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
          const dbResponse: IDataResponse<IVehicleWithId> = await insertNewVehicle(vehicleToInsert);
          //   console.log("Insert result: ", dbResponse);
          if (dbResponse.status === "ok") {
               return new Response(JSON.stringify(dbResponse.data), { status: 201 });
          } else {
               return new Response("Palvelimella tapahtui virhe!", { status: 500 });
          }
     } catch (error) {
          return new Response("Palvelimella tapahtui virhe!", { status: 500 });
     }
}
