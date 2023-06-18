import clientPromise from "./mongodb";

const DATABASE = process.env.MONGODB_DATABASE;
const usersCollection = "users";

export async function getUser(aadObjectId: string): Promise<DataResponse<AppUser>> {
     let queryResult: DataResponse<AppUser>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);
          const foundUsers = await db.collection(usersCollection).find({ aadObjectId: aadObjectId }).toArray();
          if (foundUsers.length > 1) {
               queryResult = { status: "error", data: null, error: `Found multiple users with same aadObjectId: ${aadObjectId}.` };
          } else {
               queryResult = {
                    status: "ok",
                    data: foundUsers[0]
                         ? { _id: foundUsers[0]._id, aadObjectId: foundUsers[0].aadObjectId, aadUsername: foundUsers[0].aadUsername }
                         : undefined,
               };
          }
          return queryResult;
     } catch (error: any) {
          queryResult = { status: "error", data: null, error: error };
          return queryResult;
     }
}

export async function saveNewUser(user: AppUser): Promise<DataResponse<AppUser>> {
     // console.log("Starting to save user");
     let saveResponse: DataResponse<AppUser>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);

          const newUser = await db.collection(usersCollection).insertOne(user);
          //   console.log(`New user with oid ${newUser.insertedId} inserted.`);

          return (saveResponse = { status: "ok", data: { ...user, _id: newUser.insertedId } });
     } catch (error: any) {
          // console.error("Error inserting new user. ", error);
          return (saveResponse = { status: "error", data: null, error: error });
     }
}

export async function updateUser(user: AppUser): Promise<DataResponse<AppUser>> {
     // console.log("Starting to update user");
     let saveResponse: DataResponse<AppUser>;
     try {
          const client = await clientPromise;
          const db = client.db(DATABASE);

          const updatedUser = await db.collection(usersCollection).updateOne({ _id: user._id }, { $set: { aadUsername: user.aadUsername } });
          //   console.log(`User ${updatedUser} updated.`);

          return (saveResponse = { status: "ok", data: user });
     } catch (error: any) {
          // console.error("Error updating user. ", error);
          return (saveResponse = { status: "error", data: null, error: error });
     }
}
