import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import fs from "fs";

const DATABASE = process.env.MONGODB_DATABASE;
const vehiclesCollection = "vehicles";

export async function getOwnedVehiclesForUser(userId: string): Promise<DataResponse<Vehicle[]>> {
     let queryResult: DataResponse<Vehicle[]>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicles = await db
               .collection(vehiclesCollection)
               .find({ owner: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
          queryResult = { status: "ok", data: vehicles as Vehicle[] };
          return queryResult;
     } catch (error) {
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}

export async function getPrivilegedVehiclesForUser(userId: string): Promise<DataResponse<Vehicle[]>> {
     let queryResult: DataResponse<Vehicle[]>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicles = await db
               .collection(vehiclesCollection)
               .find({ coUsers: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
          queryResult = { status: "ok", data: vehicles as Vehicle[] };
          return queryResult;
     } catch (error) {
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}

// export async function updateVehicleImage(vehicleId: string, imageSrc: string): Promise<DataResponse<null>> {
//      console.log("updateVehicleImage called");
//      let result: DataResponse<null>;
//      try {
//           const client = await clientPromise;
//           const db = client.db(DATABASE);
//           const response = await db
//                .collection(vehiclesCollection)
//                .updateOne({ _id: new ObjectId(vehicleId) }, { $set: { image: fs.readFileSync(imageSrc) } });
//           result = { status: "ok", data: null };
//           console.log("Response when saving image: ", response);
//           return result;
//      } catch (error) {
//           console.error("Error saving image: ", error);
//           result = { status: "error", data: null, error: error };
//           return result;
//      }
// }
