import { Schema, Types, model, models } from "mongoose";
import VehicleModel from "./Vehicle";
import { EventType } from "./EventType";
import { FuelType } from "./FuelType";

export interface VehicleEvent {
     vehicle: Types.ObjectId;
     eventType: EventType;
     eventDateTime: Date;
     noteText: string;
     mileage?: number;
     totalPrice: number;
     createdBy: string;
     fuelType?: FuelType;
     refuelAmount?: number;
     pricePerLiter?: number;
}

export interface VehicleEventDTO extends Omit<VehicleEvent, "vehicle"> {
     vehicle: string;
}

const eventSchema = new Schema<VehicleEvent>(
     {
          vehicle: {
               type: Schema.Types.ObjectId,
               ref: VehicleModel,
          },
          eventType: {
               typeDef: {
                    type: String,
                    required: true,
               },
               typeDescription: {
                    type: String,
                    required: true,
               },
          },
          eventDateTime: {
               type: Date,
               required: true,
          },
          noteText: {
               type: String,
          },
          totalPrice: {
               type: Number,
               min: 0,
               required: false,
          },
          mileage: {
               type: Number,
               required: false,
          },
          fuelType: {
               typeDef: {
                    type: String,
                    required: false,
               },
               typeDescription: {
                    type: String,
                    required: false,
               },
          },
          refuelAmount: {
               type: Number,
               min: 0,
               required: false,
          },
          pricePerLiter: {
               type: Number,
               min: 0,
               required: false,
          },
     },
     {
          collection: "events",
          timestamps: true,
     }
);

const EventModel = models.Event || model<VehicleEvent>("Event", eventSchema);

export default EventModel;
