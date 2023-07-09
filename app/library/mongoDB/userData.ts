import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { getDbConnection } from "./mongodb";
import IDataResponse from "@/types/dataResponse";

export interface IAppUser {
     aadObjectId: string;
     aadUsername: string;
     givenName: string | null;
     surname: string | null;
     initials?: string | null;
     theme?: "light" | "dark";
}

export interface IAppUserWithId extends IAppUser {
     _id: ObjectId;
}

const usersColl = process.env.MONGODB_USERS_COLLECTION;

/**
 * Get user information by Object ID from AzureAD
 * @param aadObjectId
 * @returns data response containing the user with given aadObjectId, if any, as data.
 *  */
export async function getUser(aadObjectId: string): Promise<IDataResponse<IAppUserWithId>> {
     try {
          const userCollection = (await getDbConnection()).collection<IAppUser>(usersColl);
          const foundUsers: IAppUserWithId[] = await userCollection.find<IAppUserWithId>({ aadObjectId: aadObjectId }).toArray();
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
export async function saveNewUser(user: IAppUser): Promise<IDataResponse<IAppUserWithId>> {
     // console.log("Starting to save user");
     try {
          const userCollection = (await getDbConnection()).collection<IAppUser>(usersColl);
          const newUser: InsertOneResult<IAppUser> = await userCollection.insertOne(user);
          //   console.log(`New user with oid ${newUser.insertedId} inserted.`);

          return { status: "ok", data: { ...user, _id: newUser.insertedId } };
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
export async function updateUser(user: IAppUserWithId): Promise<IDataResponse<IAppUserWithId>> {
     // console.log("Starting to update user");
     try {
          const userCollection = (await getDbConnection()).collection<IAppUser>(usersColl);
          const updateResult: UpdateResult<IAppUser> = await userCollection.updateOne(
               { _id: new ObjectId(user._id) },
               { $set: { aadUsername: user.aadUsername, givenName: user.givenName, surname: user.surname } }
          );
          //   console.log("User updated. ", updateResult);
          return { status: "ok", data: user };
     } catch (error: any) {
          console.error("Error updating user. ", error);
          return { status: "error", data: null, error: error };
     }
}
