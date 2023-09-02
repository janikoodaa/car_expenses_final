import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/configuration/authOptions";
import IDataResponse from "@/types/dataResponse";
import { VehicleEvent, VehicleEventDTO } from "@/app/library/models/Event";
import { getVehicleById } from "@/app/library/mongoDB/vehicleData";
import { insertNewEvent } from "@/app/library/mongoDB/eventData";

export async function POST(request: NextRequest): Promise<Response> {
     try {
          const session = await getServerSession(authOptions);
          if (!session) return new Response("Sinulla ei ole vaadittavaa oikeutta!", { status: 401 });

          const req: VehicleEventDTO = await request.json();

          // Validate request data
          const validationErrors: { property: string; error: string }[] = new Array();

          const vehicleCheck = await getVehicleById(req.vehicle, session.user.aadObjectId!);
          if (vehicleCheck.status === "error" || vehicleCheck.data === null) {
               validationErrors.push({ property: "vehicle", error: "Vehicle not found." });
               return new Response(JSON.stringify(validationErrors), { status: 406 });
          }

          if (req.eventType.typeDef === "refuel" && vehicleCheck.data.primaryFuel.typeDef !== req.fuelType?.typeDef) {
               validationErrors.push({ property: "fuelType", error: "Given fuel type not suitable for the vehicle." });
          }

          if (
               req.eventType.typeDef === "refuel" &&
               req.pricePerLiter &&
               req.refuelAmount &&
               req.pricePerLiter > 0 &&
               Math.round(req.pricePerLiter * 1000) / 1000 !== Math.round((req.totalPrice * 1000) / req.refuelAmount) / 1000
          ) {
               validationErrors.push({
                    property: "pricePerLiter",
                    error: `Given price per liter ${req.pricePerLiter} is not equal to calculated value ${
                         Math.round((req.totalPrice * 1000) / req.refuelAmount) / 1000
                    }.`,
               });
          }

          if (validationErrors.length) return new Response(JSON.stringify(validationErrors), { status: 400 });

          const dbResponse: IDataResponse<VehicleEvent> = await insertNewEvent(req);
          console.log("Insert result in /api/vehicle method POST: ", dbResponse);
          if (dbResponse.status === "ok") {
               return new Response(JSON.stringify(dbResponse), { status: 201 });
          } else {
               return new Response(JSON.stringify(dbResponse), { status: 500 });
          }
     } catch (error) {
          console.error("Unknown error in api/event method POST: ", error);
          const unknownError: IDataResponse<VehicleEvent> = {
               status: "error",
               data: null,
               error: { message: "Palvelimella tapahtui tuntematon virhe." },
          };
          return new Response(JSON.stringify(unknownError), { status: 500 });
     }
}
