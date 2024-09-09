import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var
import express from "express";  // pour express
import path from "path";   // pour creer chemin
import { fileURLToPath } from "url";  // pour convrtir url
const { default: open } = await import("open"); // ouverture automatique du navigateur
// used await was needed bc of async (speed of )

import cors from "cors";  // pour cors AKA cross origin resource sharing
// on utlise cors pour pouvoir communiquer avec le serveur (let us share data from port)
import bodyParser from "body-parser";   // pour parser les requetes
dotenv.config();
import md5 from "md5";

const port = 3000;

import crypto, { createHash } from "crypto";  // pour crypter les passwords

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

app.use(bodyParser.urlencoded({ extended: false })); // for body parser
app.use(express.json()); 
app.use(bodyParser.json());



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

app.get("/Validate", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Validate.html"));
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






// test dinsertion into db
// gonna use async + try catch here too

app.post("/Login", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();

    const { username, password } = req.body;

    const sqlQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
    const [result] = await dbConn.execute(sqlQuery, [username, md5(password)]);

    res.send("Login successful");
  } catch (error) {
    console.log("erreur insertion", error);
    res.status(500).send("Database error");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});

// insertion didnt work
//  issue maybe on loginUsername, loginPassword
// issue on line 165 const [result] = await dbConn.execute(sqlQuery, [loginUsername,loginPassword,]);
// issue was syntax err with db but now WORKEDD


function hashpassword(password) {
  return createHash('md5').update(password).digest('hex');

}

// test hash mdp

const testHash = hashpassword('nohaila');

console.log('test hash:', testHash);


// test validation

app.post("/Validate", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();

    const { username, password } = req.body;

    const sqlQuery = "SELECT password FROM users WHERE username = ?";
    const [rows] = await dbConn.execute(sqlQuery, [username]);

    if (rows.length === 0) {

      return res.status(404).send("User not found");
    }

    const hashedPassword = rows[0].password;  // creer var


    if (md5(password) === hashedPassword) {
      return res.send("valid");
    } else {
      return res.status(401).send("Invalid");
    }
  } catch (error) {
    console.log("Error validating user", error);
    res.status(500).send("db error");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});
