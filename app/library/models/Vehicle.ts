import { Schema, Types, model, models } from "mongoose";
import { IAppUser } from "./User";

export interface IVehicle {
     _id?: Types.ObjectId;
     type: "car" | "bicycle" | "motorcycle" | "van" | undefined;
     make: string;
     model: string;
     nickName: string | undefined;
     year: number;
     registeringDate: Date | null;
     registerNumber: string | undefined;
     inUseFrom: Date;
     inUseTo: Date | null;
     primaryFuel: "95E10" | "98E5" | "Diesel" | undefined;
     active: boolean;
     owner: Types.ObjectId | IAppUser;
     coUsers: Types.ObjectId[] | IAppUser[];
     imageUrl: string | null;
}

const vehicleSchema = new Schema<IVehicle>(
     {
          type: {
               type: String,
               required: true,
               enum: ["car", "bicycle", "motorcycle", "van"],
          },
          make: {
               type: String,
               required: true,
               minLength: 2,
               maxlength: 25,
          },
          model: {
               type: String,
               required: true,
               minLength: 1,
               maxlength: 50,
          },
          nickName: {
               type: String,
               maxlength: 20,
          },
          year: {
               type: Number,
               min: 1950,
               max: new Date().getFullYear() + 1,
          },
          registeringDate: {
               type: Date,
               min: new Date("1950-01-01"),
               max: new Date(),
          },
          registerNumber: {
               type: String,
               uppercase: true,
               minLength: 4,
               maxlength: 7,
               match: /[A-Z0-9]+\-[A-Z0-9]+/,
          },
          inUseFrom: {
               type: Date,
               required: true,
               min: new Date("1950-01-01"),
               max: new Date(),
          },
          inUseTo: {
               type: Date,
               min: new Date("1950-01-01"),
               max: new Date(),
               default: null,
          },
          primaryFuel: {
               type: String,
               enum: ["95E10", "98E5", "Diesel"],
               default: null,
          },
          active: {
               type: Boolean,
               required: true,
               default: true,
          },
          owner: {
               type: Schema.Types.ObjectId,
               ref: "User",
          },
          coUsers: {
               type: [Schema.Types.ObjectId],
               ref: "User",
          },
          imageUrl: {
               type: String,
               default: null,
          },
     },
     { timestamps: true }
);

const Vehicle = models.Vehicle || model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
