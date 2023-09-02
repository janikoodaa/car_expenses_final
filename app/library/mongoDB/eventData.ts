import IDataResponse from "@/types/dataResponse";
import EventModel, { VehicleEvent, VehicleEventDTO } from "../models/Event";
import { DateTime } from "luxon";
import dbConnect from "../database/dbConnect";
import FuelTypeModel, { FuelType } from "../models/FuelType";
import EventTypeModel, { EventType } from "../models/EventType";

/**
 * Save new vehicle into database
 * @param event
 * @returns data response containing Mongo save result as data
 */
export async function insertNewEvent(event: VehicleEventDTO): Promise<IDataResponse<VehicleEvent>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, insertNewEvent() with event=${JSON.stringify(event)}`);
     try {
          await dbConnect();

          const eventType: EventType | null = await EventTypeModel.findOne({ typeDef: event.eventType.typeDef });
          if (!eventType) {
               console.log(`${DateTime.now().toISO()}, returning from insertNewEvent(), startTime: ${startTime} - not found`);
               return { status: "error", data: null, error: "Ajoneuvon tyyppiä ei löytynyt." };
          }
          event.eventType = { typeDef: event.eventType.typeDef, typeDescription: eventType.typeDescription };

          if (event.eventType.typeDef === "refuel") {
               const fuelType: FuelType | null = await FuelTypeModel.findOne({ typeDef: event.fuelType?.typeDef });
               if (!fuelType) {
                    console.log(`${DateTime.now().toISO()}, returning from insertNewEvent(), startTime: ${startTime} - not found`);
                    return { status: "error", data: null, error: "Tapahtuman polttoainetyyppiä ei löytynyt." };
               }
               event.fuelType = { typeDef: event.fuelType?.typeDef!, typeDescription: fuelType.typeDescription };
          }

          const result = await new EventModel(event).save();
          console.log(`${DateTime.now().toISO()}, returning from insertNewEvent(), startTime: ${startTime} - success`);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in insertNewEvent(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}
