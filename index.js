import mysql from "mysql2/promise";  // pour mysql
import dotenv from "dotenv";    // pour env var
import express from "express";  // pour express
import session from "express-session";
import path from "path";   // pour creer chemin
import { fileURLToPath } from "url";  // pour convrtir url
const { default: open } = await import("open"); // ouverture automatique du navigateur
// used await was needed bc of async (speed of )
// import {  session }  from "express-session";

import cors from "cors";  // pour cors AKA cross origin resource sharing
// on utlise cors pour pouvoir communiquer avec le serveur (let us share data from port)
import bodyParser from "body-parser";   // pour parser les requetes
dotenv.config();
import md5 from "md5";

const port = 3000;

import { createHash } from "crypto";  // pour crypter les passwords

async function dbConnection() {
    try {
    const dbConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.password, // used .env for security
      database: "FitnessClub",
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
    const [rows] = await dbConn.execute(
      "SELECT activity_description FROM activities WHERE activity_name = ?",
      ["Pilates"]
    );
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

app.use((req, res, next) => {
  console.log(`Protocol: ${req.protocol}`); // Logs 'http' or 'https'
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // for http 
  })
);

app.get("/", (req, res) => {
   // res.send("welcome to our Gym");
})


app.listen (port, () => {
  console.log(`run serverr`);
  // open("http://localhost:3000/Homepage");

});


app.use(express.static("public"));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/Homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Homepage.html'));
});

app.get("/Accueil", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Accueil.html"));
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


app.get("/Activities", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Activities.html"));
});

app.get("/Reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Reservations.html"));
});

// test fetch on Homepage


// Route to fetch DNOM and ville from departements table
app.get("/api/data", async (req, res) => {
  let dbConn;  // necessaire pour fermer la con a la fin
  try {
    console.log("Fetching data from the database...");
    dbConn = await dbConnection(); // Create a new connection for each request
    const [rows] = await dbConn.execute(
      "SELECT activity_description FROM activities WHERE activity_name = ?", // query
      ["Pilates"] // parameters
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

    const { email, password } = req.body;

    const sqlQuery = "INSERT INTO users (email, password) VALUES (?, ?)";
    const [result] = await dbConn.execute(sqlQuery, [email, md5(password)]);

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
    dbConn = await dbConnection(); // Your database connection function

    const { email, password } = req.body;

    // Query to get hashed password and user ID
    const sqlQuery = "SELECT mdp, id_user FROM users WHERE email = ?";
    const [rows] = await dbConn.execute(sqlQuery, [email]);

    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = rows[0].mdp;

    // Validate password
    if (md5(password) === hashedPassword) {
      // Set session
      req.session.user = {
        id: rows[0].id_user, // Store user ID in the session
        email: email,
        authenticated: true,
      };

      // Redirect or send a success message
      return res.redirect("/Accueil"); // Redirect to a different route after login
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.log("Error validating user", error);
    return res.status(500).send("Database error");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});



// card activité

app.get("/activities", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();
       const [rows] = await dbConn.query(
         "SELECT activity_name, activity_description FROM activities"
       );
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});



app.post("/Register", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();
    const { nom, prenom, telephone, email, mdp } = req.body;
    const sqlQuery =
      "INSERT INTO users (nom, prenom, telephone, email, mdp) VALUES (?, ?, ?, ?, ?)";
    const [result] = await dbConn.execute(sqlQuery, [
      nom,
      prenom,
      telephone,
      email,
      md5(mdp),
    ]);
    res.send("Inscription réussie");
  } catch (error) {
    console.error("Erreur d'insertion", error);
    res.status(500).send("Erreur de bd");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});


app.get("/api/reservations", async (req, res) => {
  let dbConn;
  try {
    console.log("Session Data After Login:", req.session);
    
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    dbConn = await dbConnection();

    // Fetch user ID from  session
    const userId = req.session.user.id;

    // Query to get reservations for the logged-in user
    const sqlQuery = `
      SELECT r.id_reservation, s.nom_session, s.date_session, s.heure_session
      FROM reservations r
      JOIN sessions s ON r.id_session = s.id_session
      WHERE r.id_user = ?
    `;
    const [rows] = await dbConn.execute(sqlQuery, [userId]);

    res.json(rows); // Send reservations as JSON
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});



app.delete("/api/reservations/:id", async (req, res) => {
  let dbConn;
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    dbConn = await dbConnection();
    const reservationId = req.params.id;
    const userId = req.session.user.id;

    const sqlQuery =
      "DELETE FROM reservations WHERE id_reservation = ? AND id_user = ?";
    const [result] = await dbConn.execute(sqlQuery, [reservationId, userId]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Reservation not found or unauthorized" }); // JSON error response
    }

    res.json({ message: "Reservation cancelled successfully" }); // JSON success response
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ error: "Server error" }); // JSON error response
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});


