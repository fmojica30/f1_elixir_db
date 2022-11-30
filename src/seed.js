import mysql from "mysql";
import dotenv from 'dotenv';
import { loadDriverInfo } from "./driverInfo.js";
import { loadConstructorInfo } from "./constructorInfo.js";
import { loadGrandPrixInfo } from "./grandPrix.js";
import { loadEngineInfo } from "./engine.js";
import { loadConstructorVDriverInfo } from "./constructorVdriver.js";

import * as sqlUtils from "./sqlUtils.js";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

//await sqlUtils.resetDB(connection);
//await loadConstructorInfo(connection);
//await loadDriverInfo(connection);
//await loadGrandPrixInfo(connection); 
//await loadEngineInfo(connection); 
await loadConstructorVDriverInfo(connection);

connection.end();
process.exit();