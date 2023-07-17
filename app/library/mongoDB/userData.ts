import IDataResponse from "@/types/dataResponse";
import dbConnect from "../database/dbConnect";
import User, { IAppUser } from "../models/User";
import { HydratedDocument } from "mongoose";
import { DateTime } from "luxon";

/**
 * Get user information by Object ID from AzureAD
 * @param aadObjectId
 * @returns data response containing the user with given aadObjectId, if any, as data.
 *  */
export async function getUser(aadObjectId: string): Promise<IDataResponse<IAppUser>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, getUser() with aadObjectId=${aadObjectId}`);
     try {
          await dbConnect();
          const foundUsers: HydratedDocument<IAppUser>[] = await User.find({ aadObjectId: aadObjectId });
          console.log(`${DateTime.now().toISO()}, returning from getUser(), startTime: ${startTime} - success`);
          if (foundUsers.length > 1) {
               return { status: "error", data: null, error: `Found multiple users with same aadObjectId: ${aadObjectId}.` };
          }
          return {
               status: "ok",
               data: foundUsers[0] ?? null,
          };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in getUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Save new user into database
 * @param user
 * @returns data response containing user object with created ObjectId as data.
 */
export async function saveNewUser(user: IAppUser): Promise<IDataResponse<IAppUser>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, saveNewUser() with aadObjectId=${JSON.stringify(user)}`);
     try {
          await dbConnect();
          const result: IAppUser = await new User(user).save();
          console.log(`${DateTime.now().toISO()}, returning from saveNewUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in saveNewUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}

/**
 * Updates user data into database
 * @param user
 * @returns data response containing the given user as data, when successfully updated.
 */
export async function updateUser(user: IAppUser): Promise<IDataResponse<IAppUser>> {
     const startTime = DateTime.now().toISO();
     console.log(`${startTime}, updateUser() with aadObjectId=${JSON.stringify(user)}`);
     try {
          await dbConnect();
          const userToUpdate: HydratedDocument<IAppUser> | null = await User.findById(user._id);

          if (!userToUpdate) {
               console.log(`${DateTime.now().toISO()}, returning from updateUser(), startTime: ${startTime} - not found`);
               return { status: "error", data: null, error: `Could not find user with the given _id ${user._id}!` };
          }
          userToUpdate.aadUsername = user.aadUsername;
          userToUpdate.givenName = user.givenName;
          userToUpdate.surname = user.surname;
          const result: IAppUser = await userToUpdate.save();
          console.log(`${DateTime.now().toISO()}, returning from updateUser(), startTime: ${startTime} - success`);
          return { status: "ok", data: result };
     } catch (error: any) {
          console.error(`${DateTime.now().toISO()}, error in updateUser(), startTime: ${startTime}, message: ${error.message}`);
          return { status: "error", data: null, error: error };
     }
}
