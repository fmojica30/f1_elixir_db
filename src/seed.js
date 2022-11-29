import mysql from "mysql";
import { loadDriverInfo } from "./driverInfo.js";
import dotenv from 'dotenv';
import { loadConstructorInfo } from "./constructorInfo.js";
import { loadGrandPrixInfo } from "./grandPrix.js";
import { loadEngineInfo } from "./engine.js";
import * as sqlUtils from "./sqlUtils.js";
import { loadConstructorVDriverInfo } from "./constructorVdriver.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

await loadConstructorVDriverInfo(connection);
//await sqlUtils.resetDB(connection);
//await loadConstructorInfo(connection);
//await loadDriverInfo(connection);
//await loadGrandPrixInfo(connection); 
await loadEngineInfo(connection); 
process.exit();