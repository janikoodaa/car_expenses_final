declare global {
     namespace NodeJS {
          interface ProcessEnv {
               MONGODB_USERNAME: string;
               MONGODB_PASSWORD: string;
               MONGODB_CLUSTER_URL: string;
               MONGODB_DATABASE: string;
               ENCRYPTION_KEY: string;
               ENCRYPTION_INITIALIZATION_VECTOR: string;
               ENCRYPTION_ALGORITHM: string;
          }
     }
}
export {};
