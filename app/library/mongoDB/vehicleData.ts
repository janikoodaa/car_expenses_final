import { InsertOneResult, ObjectId } from "mongodb";
import { getDbConnection } from "./mongodb";
import { IAppUser, IAppUserWithId } from "./userData";
import IDataResponse from "@/types/dataResponse";

export interface IVehicle {
     type: "car" | "bicycle" | "motorcycle" | "van" | undefined;
     make: string;
     model: string;
     nickName: string;
     year: number;
     registeringDate: Date;
     registerNumber: string;
     inUseFrom: Date;
     InUseTo: Date;
     primaryFuel: "95E10" | "98E5" | "Diesel" | undefined;
     active: boolean;
     owner: IAppUserWithId[] | IAppUser | ObjectId;
     coUsers: IAppUserWithId[] | IAppUser | ObjectId | null;
     image: string | "";
}

export interface IVehicleWithId extends IVehicle {
     _id?: ObjectId | undefined;
}

const vehiclesCollection = process.env.MONGODB_VEHICLES_COLLECTION;
const vehiclesView = process.env.MONGODB_VEHICLES_VIEW;

/**
 * Get vehicles the user owns at the moment
 * @param userId
 * @returns data response containing array of vehicles as data
 */
export async function getOwnedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicleWithId[]>> {
     try {
          const vehicleCollection = (await getDbConnection()).collection<IVehicleWithId>(vehiclesCollection);
          const vehicles: IVehicleWithId[] = await vehicleCollection
               .find<IVehicleWithId>({ owner: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
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
export async function getGrantedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicleWithId[]>> {
     try {
          const vehicleCollection = (await getDbConnection()).collection<IVehicleWithId>(vehiclesCollection);
          const vehicles: IVehicleWithId[] = await vehicleCollection
               .find<IVehicleWithId>({ coUsers: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
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
export async function getRetiredVehiclesForUser(userId: string): Promise<IDataResponse<IVehicleWithId[]>> {
     try {
          const vehicleCollection = (await getDbConnection()).collection<IVehicleWithId>(vehiclesCollection);
          const vehicles: IVehicleWithId[] = await vehicleCollection
               .find<IVehicleWithId>({ active: false, $or: [{ owner: new ObjectId(userId) }, { coUsers: new ObjectId(userId) }] })
               .sort({ inUseTo: -1 })
               .toArray();
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
          const vehicleCollection = (await getDbConnection()).collection<IVehicle>(vehiclesView);
          const vehicle: IVehicle | null = await vehicleCollection.findOne<IVehicle>({
               $or: [{ "owner._id": new ObjectId(userId) }, { "coUsers._id": new ObjectId(userId) }],
               _id: new ObjectId(vehicleId),
          });
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
export async function insertNewVehicle(vehicle: IVehicle): Promise<IDataResponse<IVehicleWithId>> {
     try {
          // console.log("vehicle param in insertNewVehicle: ", vehicle);
          const vehicleCollection = (await getDbConnection()).collection<IVehicle>(vehiclesView);
          const insertResult: InsertOneResult<IVehicle> = await vehicleCollection.insertOne(vehicle);
          // console.log("new inserted vehicle: ", insertResult);
          return { status: "ok", data: { ...vehicle, _id: insertResult.insertedId } };
     } catch (error) {
          return { status: "error", data: null, error: error };
     }
}
