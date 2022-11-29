import mysql from "mysql";
import { loadDriverInfo } from "./driverInfo.js";
import dotenv from 'dotenv';
import { loadConstructorInfo } from "./constructorInfo.js";
import { loadGrandPrixInfo } from "./grandPrix.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

//await loadConstructorInfo(connection);
//await loadDriverInfo(connection);
await loadGrandPrixInfo(connection); 
process.exit();