import { Schema, Types, model, models } from "mongoose";

export interface IAppUser {
     _id?: Types.ObjectId;
     aadObjectId: string;
     aadUsername: string;
     givenName: string | null;
     surname: string | null;
     initials?: string | null;
     theme?: "light" | "dark";
}

const userSchema = new Schema<IAppUser>(
     {
          aadObjectId: {
               type: String,
               required: true,
          },
          aadUsername: {
               type: String,
               required: true,
          },
          givenName: {
               type: String,
          },
          surname: {
               type: String,
          },
          initials: {
               type: String,
          },
          theme: {
               type: String,
               enum: ["light", "dark"],
          },
     },
     { timestamps: true }
);

const User = models.User || model<IAppUser>("User", userSchema);

export default User;
