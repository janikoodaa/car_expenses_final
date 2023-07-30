import IDataResponse from "@/types/dataResponse";
import { cache } from "react";
import FuelTypeModel, { FuelType } from "../models/FuelType";
import { DateTime } from "luxon";
import dbConnect from "../database/dbConnect";

/**
 * Get active vehicle types
 * @returns data response containing array of vehicle types as data
 */
export const getActiveFuelTypes = cache(async (): Promise<IDataResponse<FuelType[]>> => {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getActiveFuelTypes()`);
     try {
          await dbConnect();
          const fuelTypes: FuelType[] = await FuelTypeModel.find({ active: true }).sort({
               typeDescription: 1,
          });
          console.log(`${DateTime.now().toISO()}, returning from getActiveFuelTypes(), startTime: ${startTime} - success`);
          return { status: "ok", data: fuelTypes };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getActiveFuelTypes(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
});
