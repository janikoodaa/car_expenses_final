import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/configuration/authOptions";
import { ObjectId } from "mongodb";
import { insertNewVehicle } from "@/app/library/mongoDB/vehicleData";

export async function POST(request: NextRequest): Promise<Response> {
     try {
          const session = await getServerSession(authOptions);
          if (!session) return new Response("Sinulla ei ole vaadittavaa oikeutta!", { status: 401 });

          const req = await request.json();
          //   console.log("req in POST: ", req);

          const vehicleToInsert: Partial<IVehicle> = {
               ...req,
               owner: new ObjectId(session.user._id!),
               inUseFrom: new Date(req.inUseFrom),
               registeringDate: new Date(req.registeringDate),
          };
          const dbResponse: IDataResponse<IVehicle> = await insertNewVehicle(vehicleToInsert);
          //   console.log("Insert result: ", dbResponse);
          //   Insert result:  {
          //         status: 'ok',
          //         data: {
          //             acknowledged: true,
          //             insertedId: new ObjectId("xxxxxxxxxxxxx")
          //         }
          //         }

          return new Response("Auto tallennettu", { status: 201 });
     } catch (error) {
          return new Response("Palvelimella tapahtui virhe!", { status: 500 });
     }
}
