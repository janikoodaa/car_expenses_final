import Vehicle, { IVehicle } from "../models/Vehicle";
import IDataResponse from "@/types/dataResponse";
import dbConnect from "../database/dbConnect";
import { HydratedDocument } from "mongoose";
import { DateTime } from "luxon";

/**
 * Get vehicles the user owns at the moment
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getOwnedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getOwnedVehiclesForUser() with userId=${userId}`);
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ owner: userId, active: true }).sort({ inUseFrom: -1 });
          console.log(`${DateTime.now().toISO()}, returning from getOwnedVehiclesForUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicles };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getOwnedVehiclesForUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get vehicles the user has right to use at the moment
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getGrantedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getGrantedVehiclesForUser() with userId=${userId}`);
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ coUsers: userId, active: true }).sort({
               inUseFrom: -1,
          });
          console.log(`${DateTime.now().toISO()}, returning from getGrantedVehiclesForUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicles };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getGrantedVehiclesForUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get vehicles the user has owned or has had right to use
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getRetiredVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getRetiredVehiclesForUser() with userId=${userId}`);
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({
               active: false,
               $or: [{ owner: userId }, { coUsers: userId }],
          }).sort({ inUseTo: -1 });
          console.log(`${DateTime.now().toISO()}, returning from getRetiredVehiclesForUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicles };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getRetiredVehiclesForUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get vehicle by id. UserId is needed to protect data so, that only vehicle user has right to, will be returned.
 * @param vehicleId
 * @param userId
 * @returns data response containing vehicle as data
 */
export async function getVehicleById(vehicleId: string, userId: string): Promise<IDataResponse<IVehicle>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getVehicleById() with vehicleId=${vehicleId} and userId=${userId}`);
     try {
          await dbConnect();
          const vehicle = await Vehicle.findOne({
               $or: [{ owner: userId }, { coUsers: userId }],
               _id: vehicleId,
          }).populate(["owner", "coUsers"]);
          console.log(`${DateTime.now().toISO()}, returning from getVehicleById(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicle };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getVehicleById(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Save new vehicle into database
 * @param vehicle
 * @returns data response containing Mongo save result as data
 */
export async function insertNewVehicle(vehicle: IVehicle): Promise<IDataResponse<IVehicle>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, insertNewVehicle() with vehicle=${JSON.stringify(vehicle)}`);
     try {
          await dbConnect();
          const result = await new Vehicle(vehicle).save();
          console.log(`${DateTime.now().toISO()}, returning from insertNewVehicle(), startTime: ${startTime} - success`);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in insertNewVehicle(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Update existing vehicle into database
 * @param vehicle
 * @returns data response containing Mongo save result as data
 */
export async function updateVehicle(vehicle: IVehicle): Promise<IDataResponse<IVehicle>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, updateVehicle() with vehicle=${JSON.stringify(vehicle)}`);
     try {
          await dbConnect();
          const vehicleInDb: HydratedDocument<IVehicle> | null = await Vehicle.findOne({
               owner: vehicle.owner,
               _id: vehicle._id,
          });

          if (!vehicleInDb) {
               console.log(`${DateTime.now().toISO()}, returning from updateVehicle(), startTime: ${startTime} - not found`);
               return { status: "error", data: null, error: "Ajoneuvoa annetulla id:llä ei löytynyt." };
          }
          vehicleInDb.type = vehicle.type;
          vehicleInDb.make = vehicle.make;
          vehicleInDb.model = vehicle.model;
          vehicleInDb.nickName = vehicle.nickName;
          vehicleInDb.year = vehicle.year;
          vehicleInDb.registeringDate = vehicle.registeringDate;
          vehicleInDb.registerNumber = vehicle.registerNumber;
          vehicleInDb.inUseFrom = vehicle.inUseFrom;
          vehicleInDb.inUseTo = vehicle.inUseTo;
          vehicleInDb.primaryFuel = vehicle.primaryFuel;
          if (vehicleInDb.active !== vehicle.active) {
               vehicleInDb.inUseTo = vehicle.active ? null : DateTime.utc().toJSDate();
               vehicleInDb.active = vehicle.active;
          }
          vehicleInDb.imageUrl = vehicle.imageUrl;
          const result = await vehicleInDb.save();

          console.log(`${DateTime.now().toISO()}, returning from updateVehicle(), startTime: ${startTime} - success`);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in updateVehicle(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}
