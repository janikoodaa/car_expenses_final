import { Schema, Types, model, models } from "mongoose";

export interface VehicleType {
     _id?: Types.ObjectId;
     typeDef: string;
     active?: boolean;
     typeDescription: string;
}

const vehicleTypeSchema = new Schema<VehicleType>(
     {
          typeDef: {
               type: String,
               required: true,
          },
          active: {
               type: Boolean,
               required: true,
               default: true,
          },
          typeDescription: {
               type: String,
               required: true,
          },
     },
     {
          collection: "vehicleTypes",
          timestamps: true,
     }
);

const VehicleTypeModel = models.VehicleType || model<VehicleType>("VehicleType", vehicleTypeSchema);

export default VehicleTypeModel;
