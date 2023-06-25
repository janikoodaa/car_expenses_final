import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

const DATABASE = process.env.MONGODB_DATABASE;
const vehiclesCollection = "vehicles";
const vehiclesView = "vehiclesView";

export async function getOwnedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     let queryResult: IDataResponse<IVehicle[]>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicles = await db
               .collection(vehiclesCollection)
               .find({ owner: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
          queryResult = { status: "ok", data: vehicles as IVehicle[] };
          return queryResult;
     } catch (error) {
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}

export async function getGrantedVehiclesForUser(userId: string): Promise<IDataResponse<IVehicle[]>> {
     let queryResult: IDataResponse<IVehicle[]>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicles: any = await db
               .collection(vehiclesCollection)
               .find({ coUsers: new ObjectId(userId), active: true })
               .sort({ inUseFrom: -1 })
               .toArray();
          queryResult = { status: "ok", data: vehicles as IVehicle[] };
          return queryResult;
     } catch (error) {
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}

export async function getVehicleById(vehicleId: string, userId: string): Promise<IDataResponse<IVehicle>> {
     let queryResult: IDataResponse<IVehicle>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const vehicle: any = await db.collection(vehiclesView).findOne({
               $or: [{ "owner._id": new ObjectId(userId) }, { "coUsers._id": new ObjectId(userId) }],
               _id: new ObjectId(vehicleId),
          });
          queryResult = { status: "ok", data: vehicle as IVehicle };
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
