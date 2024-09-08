import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var
import express from "express";  // pour express
import path from "path";   // pour creer chemin
import { fileURLToPath } from "url";  // pour convrtir url
const { default: open } = await import("open"); // ouverture automatique du navigateur
// used await was needed bc of async (speed of )

import cors from "cors";  // pour cors AKA cross origin resource sharing
// on utlise cors pour pouvoir communiquer avec le serveur (let us share data from port)
dotenv.config();

const port = 3000;

async function dbConnection() {
    try {
    const dbConn = await
    mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.password,  // used .env for security
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
      console.error('query error:', querErr.message);
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

app.use(cors());  // for cors
app.get("/", (req, res) => {
 //  res.send("welcome to our Gym");
})


app.listen (port, () => {
  console.log(`run serverr`);
  // commented this bc reopening was annoying
  // open("http://localhost:3000/Homepage");

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


// test fetch on Homepage


// Route to fetch DNOM and ville from departements table
app.get("/api/data", async (req, res) => {
  let dbConn;  // necessaire pour fermer la con a la fin
  try {
    console.log("Fetching data from the database...");
    dbConn = await dbConnection(); // Create a new connection for each request
    const [rows] = await dbConn.execute(
      "SELECT ville FROM departements WHERE DNOM = ?",  // query
      ["RH"]   // parameters
    );
    console.log("Query successful:", rows);
    res.json(rows); // Send the results as JSON
  } catch (queryErr) {
    console.error("Query error:", queryErr.message);
    res.status(500).json({ error: "Server error" }); // Send a JSON error response
  } finally {
    if (dbConn && dbConn.end) {
      try {
        await dbConn.end(); // Close connection
      } catch (closeErr) {
        console.error("Closing connection error", closeErr.message);
      }
    }
  }
});


// code not working yet so tried to install cors bc
// Failed to load resource: the server responded with a status of 500 (Internal Server Error)
// Error fetching data: SyntaxError: Unexpected token 'S', "Server error" is not valid JSON

// code did not work bc of cors absence and also bc of syntax error front was expecting
// an array while my sql returned an object
// prob in db conn scope

// corrected code try catch + syntax error + opened con inside app get req and it worked!!
// front received array of obj not just one 
// WORKEDDD
