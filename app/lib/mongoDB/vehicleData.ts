import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

const DATABASE = process.env.MONGODB_DATABASE;
const vehiclesCollection = "vehicles";

export async function GetOwnedVehiclesForUser(userId: string): Promise<DataResponse<Vehicle[]>> {
     let queryResult: DataResponse<Vehicle[]>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicles = await db
               .collection(vehiclesCollection)
               .find({ owner: new ObjectId(userId) })
               .toArray();
          queryResult = { status: "ok", data: vehicles as Vehicle[] };
          return queryResult;
     } catch (error) {
          console.error("Error getting users vehicles: ", error);
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}
