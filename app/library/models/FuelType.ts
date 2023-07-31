import { Schema, Types, model, models } from "mongoose";

export interface FuelType {
     _id?: Types.ObjectId;
     type: string;
     active?: boolean;
     typeDescription: string;
}

const fuelTypeSchema = new Schema<FuelType>(
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
          collection: "fuelTypes",
          timestamps: true,
     }
);

const FuelTypeModel = models.FuelType || model<FuelType>("FuelType", fuelTypeSchema);

export default FuelTypeModel;
