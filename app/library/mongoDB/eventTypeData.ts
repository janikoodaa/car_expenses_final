import IDataResponse from "@/types/dataResponse";
import { cache } from "react";
import EventTypeModel, { EventType } from "../models/EventType";
import { DateTime } from "luxon";
import dbConnect from "../database/dbConnect";

/**
 * Get available event types
 * @returns data response containing array of event types as data
 */
export const getEventTypes = cache(async (): Promise<IDataResponse<EventType[]>> => {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getEventTypes()`);
     try {
          await dbConnect();
          const fuelTypes: EventType[] = await EventTypeModel.find({}).sort({
               typeDescription: 1,
          });
          console.log(`${DateTime.now().toISO()}, returning from getEventTypes(), startTime: ${startTime} - success`);
          return { status: "ok", data: fuelTypes };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getEventTypes(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
});
