import { Schema, Types, model, models } from "mongoose";
import { IAppUser } from "./User";
import { DateTime } from "luxon";
import { decryptString } from "../mongoDB/stringEncryption";
import FuelTypeModel, { FuelType } from "./FuelType";
import VehicleTypeModel, { VehicleType } from "./VehicleType";

export interface IVehicle {
     _id?: Types.ObjectId;
     type: VehicleType | undefined;
     make: string;
     model: string;
     nickName: string | undefined;
     year: number;
     registeringDate: Date | null;
     registerNumber: string | undefined;
     registerNumberPlain: string | undefined;
     inUseFrom: Date;
     inUseTo: Date | null;
     primaryFuel: FuelType | undefined;
     active: boolean;
     ownerId: string;
     coUserIds: string[];
     imageUrl: string | null;
}

export interface VehicleWithUsers extends IVehicle {
     owner: IAppUser;
     coUsers: IAppUser[];
}

const vehicleSchema = new Schema<IVehicle>(
     {
          type: {
               type: Schema.Types.ObjectId,
               ref: VehicleTypeModel,
          },
          // type: {
          //      type: String,
          //      required: true,
          // },
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
          },
          registeringDate: {
               type: Date,
               min: new Date("1950-01-01"),
          },
          registerNumber: {
               type: String,
          },
          inUseFrom: {
               type: Date,
               required: true,
               min: new Date("1950-01-01"),
          },
          inUseTo: {
               type: Date,
               min: new Date("1950-01-01"),
               default: null,
          },
          primaryFuel: {
               type: Schema.Types.ObjectId,
               ref: FuelTypeModel,
          },
          active: {
               type: Boolean,
               required: true,
               default: true,
          },
          ownerId: {
               type: String,
               required: true,
          },
          coUserIds: {
               type: [String],
          },
          imageUrl: {
               type: String,
               default: null,
          },
     },
     {
          collection: "vehicles",
          timestamps: true,
          virtuals: true,
     }
);

vehicleSchema.virtual("registerNumberPlain").get(function () {
     return this.registerNumber ? decryptString(this.registerNumber) : "";
});

vehicleSchema.pre("validate", function (next) {
     if (this.registeringDate && this.registeringDate > this.inUseFrom) {
          this.invalidate("registeringDate", "Registering date cannot be later than the date, when vehicle is taken into use.", this.inUseFrom);
     }
     if (this.inUseFrom > DateTime.now().toJSDate()) {
          this.invalidate("inUseFrom", "Saving a vehicle in advance (before taking into use) is not allowed.", this.inUseFrom);
     }
     if (this.inUseTo && this.inUseTo > DateTime.now().toJSDate()) {
          this.invalidate("inUseTo", "Retiring a vehicle in advance is not allowed.", this.inUseTo);
     }
     if (this.inUseTo && this.inUseTo < this.inUseFrom) {
          this.invalidate("inUseTo", "Taking a vehicle into use must be earlier than retirement.", this.inUseTo);
     }
     if (this.year > DateTime.now().plus({ year: 1 }).year) {
          this.invalidate("year", "Vehicle model year cannot be greater than current year + 1.", this.year);
     }
     next();
});

const Vehicle = models.Vehicle || model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;
