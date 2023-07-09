declare global {
     namespace NodeJS {
          interface ProcessEnv {
               MONGODB_URI: string;
               MONGODB_DATABASE: string;
               MONGODB_USERS_COLLECTION: string;
               MONGODB_VEHICLES_COLLECTION: string;
               MONGODB_VEHICLES_VIEW: string;
          }
     }
}
export {};
