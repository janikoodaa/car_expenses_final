import { Schema, Types, model, models } from "mongoose";

export interface VehicleType {
     _id?: Types.ObjectId;
     type: string;
     active?: boolean;
     typeDescription: string;
}

const vehicleTypeSchema = new Schema<VehicleType>(
     {
          type: {
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

const VehicleTypeModel = models.VehicleTypeModel || model<VehicleType>("VehicleTypeModel", vehicleTypeSchema);

export default VehicleTypeModel;
