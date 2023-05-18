import sql from "mssql";

const sqlConfig: sql.config = {
     user: process.env.DB_USER,
     password: process.env.DB_PWD,
     database: process.env.DB_NAME,
     server: process.env.DB_SERVER!,
     port: parseInt(process.env.DB_PORT!),
     pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
     },
     options: {
          encrypt: true, // for azure
          trustServerCertificate: process.env.NODE_ENV === "production" ? false : true, // change to true for local dev / self-signed certs
     },
};

export async function sqlConnection() {
     try {
          await sql.connect(sqlConfig);
          return sql;
     } catch (error) {
          console.log("Error while connecting to database. ", error);
     }
}
