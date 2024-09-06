import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var

dotenv.config();

const port = 3000;

function dbConnection() { mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: process.env.password,
    database: "internship",
    port: 3306,
  })
  .then((connection) => {
    console.log("Connected !!");

    return connection.end();
  })
  .catch((err) => {
    console.error("Erreur", err.message);
  });
}

dbConnection();