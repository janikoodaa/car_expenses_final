import IDataResponse from "@/types/dataResponse";
import dbConnect from "../database/dbConnect";
import User, { IAppUser } from "../models/User";
import { HydratedDocument } from "mongoose";

/**
 * Get user information by Object ID from AzureAD
 * @param aadObjectId
 * @returns data response containing the user with given aadObjectId, if any, as data.
 *  */
export async function getUser(aadObjectId: string): Promise<IDataResponse<IAppUser>> {
     try {
          await dbConnect();
          const foundUsers: HydratedDocument<IAppUser>[] = await User.find({ aadObjectId: aadObjectId });
          if (foundUsers.length > 1) {
               return { status: "error", data: null, error: `Found multiple users with same aadObjectId: ${aadObjectId}.` };
          }
          return {
               status: "ok",
               data: foundUsers[0] ?? null,
          };
     } catch (error: any) {
          console.error("Error getting user. ", error);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Save new user into database
 * @param user
 * @returns data response containing user object with created ObjectId as data.
 */
export async function saveNewUser(user: IAppUser): Promise<IDataResponse<IAppUser>> {
     // console.log("Starting to save user");
     try {
          await dbConnect();
          const result: IAppUser = await new User(user).save();
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error("Error inserting new user. ", error);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Updates user data into database
 * @param user
 * @returns data response containing the given user as data, when successfully updated.
 */
export async function updateUser(user: IAppUser): Promise<IDataResponse<IAppUser>> {
     // console.log("Starting to update user");
     try {
          await dbConnect();
          const userToUpdate: HydratedDocument<IAppUser> | null = await User.findById(user._id);

          if (!userToUpdate) return { status: "error", data: null, error: `Could not find user with the given _id ${user._id}!` };

          userToUpdate.aadUsername = user.aadUsername;
          userToUpdate.givenName = user.givenName;
          userToUpdate.surname = user.surname;
          const result: IAppUser = await userToUpdate.save();
          //   console.log("User updated. ", updateResult);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error("Error updating user. ", error);
          return { status: "error", data: null, error: error };
     }
}
