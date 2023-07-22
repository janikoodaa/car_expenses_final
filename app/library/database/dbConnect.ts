import mongoose from "mongoose";

const { MONGODB_DATABASE, MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER_URL } = process.env;

if (!MONGODB_USERNAME) {
     throw new Error("Please define the MONGODB_USERNAME environment variable inside .env.local");
}
if (!MONGODB_PASSWORD) {
     throw new Error("Please define the MONGODB_PASSWORD environment variable inside .env.local");
}
if (!MONGODB_CLUSTER_URL) {
     throw new Error("Please define the MONGODB_CLUSTER_URL environment variable inside .env.local");
}
if (!MONGODB_DATABASE) {
     throw new Error("Please define the MONGODB_DATABASE environment variable inside .env.local");
}

const userName = encodeURIComponent(MONGODB_USERNAME);
const password = encodeURIComponent(MONGODB_PASSWORD);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
     cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
     if (cached.conn) {
          return cached.conn;
     }

     if (!cached.promise) {
          const opts = {
               bufferCommands: false,
          };

          cached.promise = mongoose
               .connect(`mongodb+srv://${userName}:${password}@${MONGODB_CLUSTER_URL}${MONGODB_DATABASE}`, opts)
               .then((mongoose) => {
                    return mongoose;
               });
     }

     try {
          cached.conn = await cached.promise;
     } catch (e) {
          cached.promise = null;
          throw e;
     }

     return cached.conn;
}

export default dbConnect;
