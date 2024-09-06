import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var

dotenv.config();

const port = 3000;

async function dbConnection() {
    try {
    const dbConn = await
    mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.password,
    database: "entreprise",
    port: 3306,
  });
    console.log("Connected !!");
    return dbConn;
  } catch (err) {
    console.error("erreur de conn", err.message);
    throw err;
  }
}


// test query func
async function quer(dbConn) {
  try {
    const [rows] = await dbConn.execute('SELECT ville FROM departements WHERE DNOM = ?', ['RH']);
    console.log('res', rows);
    }
    catch(querErr) {
      console.error('query error:', queryErr.message);
    }
}

(async () => {
  let dbConn;
  try {
    dbConn = await dbConnection();
    await quer(dbConn);
  } catch (error) {
    console.error('An error occurred:', error.message);
  } finally {
    if (dbConn && dbConn.end) {
      try {
        await dbConn.end();    // fermer con
      } catch (closeErr) {
        console.error("closing conn error", closeErr.message);
      }
    }
  }
})();
