import { NextResponse, NextRequest } from "next/server";
import sql from "mssql";
import { sqlConfig } from "@/app/configuration/azureSQLConfiguration";
import { getToken, JWT } from "next-auth/jwt";

export async function GET(req: NextRequest) {
     const token: JWT | null = await getToken({ req });
     // console.log("token: ", JSON.stringify(token, null, 2));
     if (token) {
          const pool = await sql.connect(sqlConfig);
          const cars = await pool.query("select * from CarExpenses.CarsOfUser where UserId = 1").then((res) => res.recordset);

          return NextResponse.json(cars, { status: 200 });
     }
     return NextResponse.json(token, { status: 401 });
}
