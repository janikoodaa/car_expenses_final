import { Schema, Types, model, models } from "mongoose";

export interface EventType {
     _id?: Types.ObjectId;
     type: string;
     typeDescription: string;
}

const eventTypeSchema = new Schema<EventType>(
     {
          type: {
               type: String,
               required: true,
          },
          typeDescription: {
               type: String,
               required: true,
          },
     },
     {
          collection: "eventTypes",
          timestamps: true,
     }
);

const EventTypeModel = models.EventType || model<EventType>("EventType", eventTypeSchema);

export default EventTypeModel;
