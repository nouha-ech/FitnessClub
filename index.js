import mysql from "mysql2/promise";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
const { default: open } = await import("open");
import bodyParser from "body-parser";
import { createHash } from "crypto";
import md5 from "md5";
dotenv.config();
const port = 3000;



async function dbConnection() {
    try {
    const dbConn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.password,
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

const app = express();


app.use(bodyParser.urlencoded({ extended: false })); // for body parser
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // console.log(`Protocol: ${req.protocol}`);
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

app.listen (port, () => {
  console.log(`run serverr`);
   open("http://localhost:3000/Homepage");

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


 app.get("/Reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reserve.html"));
 });

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});




function hashpassword(password) {
  return createHash('md5').update(password).digest('hex');

}

// test hash mdp

const testHash = hashpassword('nohaila');

console.log('test hash:', testHash);


// mdpvalidation

app.post("/Validate", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();

    const { email, password } = req.body;

    const sqlQuery = "SELECT mdp, id_user FROM users WHERE email = ?";
    const [rows] = await dbConn.execute(sqlQuery, [email]);

    if (rows.length === 0) {
      return res.status(404).send("User not found");
    }

    const hashedPassword = rows[0].mdp;
    if (md5(password) === hashedPassword) {
      
      req.session.user = {
        id: rows[0].id_user, // Store user ID in the session
        email: email,
        authenticated: true,
      };

      setTimeout(() => {
        return res.redirect("/Accueil");}, 100); 
        console.log("Session data:", req.session);// log session data
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

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && req.session.user.authenticated) {
    next();
  } else {
      res
        .status(401)
        .send(
          "<h1>Unauthorized</h1><p>You are not authorized to view this page. Please log in.</p>"
        );
  }
}


// sign up

app.post("/SignUp", async (req, res) => {
  let dbConn;
  try {
    dbConn = await dbConnection();

    const { nom, prenom, telephone, email, password } = req.body;

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUser] = await dbConn.execute(checkEmailQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).send("Email already registered");
    }

    const sqlQuery = "INSERT INTO users (nom, prenom, telephone, email, mdp) VALUES (?, ?, ?, ?, ?)";
    const hashedPassword = md5(password); // Hash the password
    await dbConn.execute(sqlQuery, [nom,prenom,telephone,email,hashedPassword,]);

    res.send("Inscription réussie");
  } catch (error) {
    console.log("Erreur d'insertion", error);
    res.status(500).send("Erreur de base de données");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});

// fetch sessions
app.get('/api/sessions', isAuthenticated, async (req, res) => {
    let dbConn;
    try {
        dbConn = await dbConnection();

        const sqlQuery = `
            SELECT s.id_session, s.nom_session, s.date_session, s.heure_session, s.place_disponible
            FROM sessions s
        `;
        const [rows] = await dbConn.execute(sqlQuery);

        res.json(rows); 
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (dbConn) {
            await dbConn.end();
        }
    }
});



// Endpoint to create a reservation
app.post("/api/reservations", isAuthenticated, async (req, res) => {
  let dbConn;
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    dbConn = await dbConnection();

    const userId = req.session.user.id;

    // Check if there are available places
    const [session] = await dbConn.execute(
      "SELECT place_disponible FROM sessions WHERE id_session = ?",
      [sessionId]
    );
    if (session.length === 0 || session[0].place_disponible <= 0) {
      return res.status(400).json({ error: "No available places" });
    }

    // Create reservation
    await dbConn.execute(
      "INSERT INTO reservations (id_session, id_user) VALUES (?, ?)",
      [sessionId, userId]
    );

    // Update available places
    await dbConn.execute(
      "UPDATE sessions SET place_disponible = place_disponible - 1 WHERE id_session = ?",
      [sessionId]
    );

    res.status(201).json({ message: "Reservation created" });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});


// to get unique reservations for logged in user

app.get("/api/reservations", async (req, res) => {
  let dbConn;
  try {
    console.log("Session Data After Login:", req.session);

    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    dbConn = await dbConnection();

    const userId = req.session.user.id;

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
  if (!req.session || !req.session.user) {
    return res.status(401).send("User not authenticated");
  }

  const reservationId = req.params.id;

  try {
    const dbConn = await dbConnection();

    const [reservation] = await dbConn.execute(
      "SELECT id_session FROM reservations WHERE id_reservation = ?",
      [reservationId]
    );

    if (reservation.length === 0) {
      return res.status(404).send("Reservation not found");
    }

    const sessionId = reservation[0].id_session;

    await dbConn.execute(
      "UPDATE sessions SET place_disponible = place_disponible + 1 WHERE id_session = ?",
      [sessionId]
    );

    await dbConn.execute("DELETE FROM reservations WHERE id_reservation = ?", [
      reservationId,
    ]);

    res.send("Reservation cancelled and session slot updated successfully");
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).send("Server error");
  }
});


// fetch user info for profile

app.get("/getUserInfo", async (req, res) => {
  let dbConn;
  const userId = req.session.user.id;
  try {
    dbConn = await dbConnection();
    const { nom, prenom, telephone, email } = req.body;


    const sqlQuery =
      "SELECT nom, prenom, telephone, email FROM users WHERE id_user = ?";
    const [rows] = await dbConn.execute(sqlQuery, [userId]);

    res.json(rows);
  } catch (error) {
    console.log("Database error:", error);
    res.status(500).send("Database error");
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});

// update profile
app.patch("/updateUserInfo", async (req, res) => {
  let dbConn;
  const userId = req.session.user.id;
  try {
    dbConn = await dbConnection();
    const { nom, prenom, telephone, email } = req.body;

    if (!nom || !prenom || !telephone || !email) {
      return res.status(400).json({
        message: "All fields (nom, prenom, telephone, email) are required",
      });
    }

    
    const sqlQuery =
      "UPDATE users SET nom = ?, prenom = ?, telephone = ?, email = ? WHERE id_user = ?";
    const [result] = await dbConn.execute(sqlQuery,
      [nom,prenom,telephone,email,userId,]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  } finally {
    if (dbConn) {
      await dbConn.end();
    }
  }
});


//  destroy session
app.post('/logout', (req, res) => {
    console.log('Logout request received');
     console.log("Session data before destroy:", req.session);

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }

        console.log('Session destroyed successfully');
        res.redirect('/Homepage');
         console.log("Session data after destroy:", req.session);
    });
});
