import IDataResponse from "@/types/dataResponse";
import { cache } from "react";
import VehicleTypeModel, { VehicleType } from "../models/VehicleType";
import { DateTime } from "luxon";
import dbConnect from "../database/dbConnect";

/**
 * Get active vehicle types
 * @returns data response containing array of vehicle types as data
 */
export const getActiveVehicleTypes = cache(async (): Promise<IDataResponse<VehicleType[]>> => {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getActiveVehicleTypes()`);
     try {
          await dbConnect();
          const vehicleTypes: VehicleType[] = await VehicleTypeModel.find({ active: true }).sort({
               typeDescription: 1,
          });
          console.log(`${DateTime.now().toISO()}, returning from getActiveVehicleTypes(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicleTypes };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getActiveVehicleTypes(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
});
