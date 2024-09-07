import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var
import express from "express";  // pour express
import path from "path";
import { fileURLToPath } from "url";



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


const app = express();
app.get("/", (req, res) => {
 //  res.send("welcome to our Gym");
})


app.listen (port, () => {
  console.log(`run serverr`);
});


app.use(express.static("public"));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/Homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Homepage.html'));
});

app.get("/Login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/Signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Signup.html"));
});