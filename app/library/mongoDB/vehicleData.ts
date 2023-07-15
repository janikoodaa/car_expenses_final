import Vehicle, { IVehicle } from "../models/Vehicle";
import IDataResponse from "@/types/dataResponse";
import dbConnect from "../database/dbConnect";
import { HydratedDocument } from "mongoose";

/**
 * Get vehicles the user owns at the moment
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getOwnedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ owner: userId, active: true }).sort({ inUseFrom: -1 });
          return { status: "ok", data: vehicles };
     } catch (error) {
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get vehicles the user has right to use at the moment
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getGrantedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ coUsers: userId, active: true }).sort({
               inUseFrom: -1,
          });
          return { status: "ok", data: vehicles };
     } catch (error) {
          return { status: "error", data: null, error: error };
     }
}

/**
 * Get vehicles the user has owned or has had right to use
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getRetiredVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     try {
          await dbConnect();
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({
               active: false,
               $or: [{ owner: userId }, { coUsers: userId }],
          }).sort({ inUseTo: -1 });
          // console.log("found retired vehicles: ", vehicles);
          return { status: "ok", data: vehicles };
     } catch (error) {
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
     try {
          await dbConnect();
          const vehicle = await Vehicle.findOne({
               $or: [{ owner: userId }, { coUsers: userId }],
               _id: vehicleId,
          }).populate(["owner", "coUsers"]);
          return { status: "ok", data: vehicle };
     } catch (error) {
          return { status: "error", data: null, error: error };
     }
}

/**
 * Save new vehicle into database
 * @param vehicle
 * @returns data response containing Mongo insert result as data
 */
export async function insertNewVehicle(vehicle: IVehicle): Promise<IDataResponse<IVehicle>> {
     try {
          // console.log("vehicle param in insertNewVehicle: ", vehicle);
          await dbConnect();
          const result = await new Vehicle(vehicle).save();
          // console.log("new inserted vehicle: ", result);
          return { status: "ok", data: result };
     } catch (error) {
          console.error("Error inserting new vehicle in function insertNewVehicle: ", error);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Update existing vehicle into database
 */
export async function updateVehicle(vehicle: IVehicle): Promise<IDataResponse<IVehicle>> {
     try {
          // console.log("vehicle param in updateVehicle: ", vehicle);
          await dbConnect();
          // const result = await new Vehicle(vehicle).save();
          const vehicleInDb: HydratedDocument<IVehicle> | null = await Vehicle.findOne({
               owner: vehicle.owner,
               _id: vehicle._id,
          });

          if (!vehicleInDb) return { status: "error", data: null, error: "Ajoneuvoa annetulla id:llä ei löytynyt." };

          vehicleInDb.type = vehicle.type;
          vehicleInDb.make = vehicle.make;
          vehicleInDb.model = vehicle.model;
          vehicleInDb.nickName = vehicle.nickName;
          const result = await vehicleInDb.save();

          // console.log("new inserted vehicle: ", result);
          return { status: "ok", data: result };
     } catch (error) {
          console.error("Error updateing vehicle in function updateVehicle: ", error);
          return { status: "error", data: null, error: error };
     }
}
