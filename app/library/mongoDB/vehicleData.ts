import Vehicle, { IVehicle, VehicleWithUsers } from "../models/Vehicle";
import IDataResponse from "@/types/dataResponse";
import dbConnect from "../database/dbConnect";
import { HydratedDocument } from "mongoose";
import { DateTime } from "luxon";
import { getUserFromGraphById } from "../msGraph/getUserFromGraph";
import { IAppUser } from "../models/User";

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
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ ownerId: userId, active: true }).sort({ inUseFrom: -1 });
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
          const vehicles: HydratedDocument<IVehicle>[] = await Vehicle.find({ coUserIds: userId, active: true }).sort({
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
               $or: [{ ownerId: userId }, { coUserIds: userId }],
          }).sort({ inUseTo: -1 });
          console.log(`${DateTime.now().toISO()}, returning from getRetiredVehiclesForUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicles };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getRetiredVehiclesForUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

async function getUsers(users: string[]): Promise<IAppUser[]> {
     const appUsers: IAppUser[] = new Array();
     await Promise.all(
          users.map(async (user) => {
               const userData = await getUserFromGraphById(user);
               appUsers.push(userData.data!);
          })
     );
     console.log("appUsers: ", appUsers);
     return appUsers;
}

/**
 * Get vehicle by id. UserId is needed to protect data so, that only vehicle user has right to, will be returned.
 * @param vehicleId
 * @param userId
 * @returns data response containing vehicle as data
 */
export async function getVehicleById(vehicleId: string, userId: string): Promise<IDataResponse<VehicleWithUsers>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getVehicleById() with vehicleId=${vehicleId} and userId=${userId}`);
     try {
          await dbConnect();
          const vehicle: IVehicle = (
               await Vehicle.findOne({
                    $or: [{ ownerId: userId }, { coUserIds: userId }],
                    _id: vehicleId,
               })
          ).toObject();
          if (!vehicle) return { status: "ok", data: null, error: "Vehicle not found." };

          // Hydrate owner data into vehicle
          const owner = await getUserFromGraphById(vehicle.ownerId);
          if (owner.status === "error" || !owner.data) {
               return { status: "error", data: null, error: "Error getting user data from MS Graph." };
          }
          const vehicleWithUsers: VehicleWithUsers = { ...vehicle, owner: owner.data, coUsers: new Array() };

          // If coUsers exist, hydrate them into vehicle
          if (vehicleWithUsers.coUserIds.length > 0) {
               await Promise.all(
                    vehicleWithUsers.coUserIds.map(async (user) => {
                         const userData = await getUserFromGraphById(user);
                         if (userData.data) {
                              vehicleWithUsers.coUsers.push(userData.data);
                         }
                    })
               );
          }

          console.log(`${DateTime.now().toISO()}, returning from getVehicleById(), startTime: ${startTime} - success`);
          return { status: "ok", data: vehicleWithUsers };
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
               owner: vehicle.ownerId,
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
