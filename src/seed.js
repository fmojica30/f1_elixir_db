import mysql from "mysql";
import { loadDriverInfo } from "./driverInfo.js";
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

loadDriverInfo(connection);