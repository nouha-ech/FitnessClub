# Fitness Club Management System

This is a web-based application built using Node.js, Express.js, and MySQL that allows users to manage a fitness club. The application provides the following features:

1. User registration and authentication
2. Session management and authorization
3. Reservation management
4. User profile management

## Prerequisites

1. Node.js (version 14 or higher)
2. MySQL database
3. `.env` file with the following variables:
   - `password`: MySQL database password
   - `SESSION_SECRET`: Secret key for session management

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/FitnessClub/fitness-club.git
   ```

2. Navigate to the project directory:

   ```
   cd fitness-club
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create the MySQL database and tables:

   ```sql
   CREATE DATABASE FitnessClub;

   CREATE TABLE users (
     id_user INT AUTO_INCREMENT PRIMARY KEY,
     nom VARCHAR(255),
     prenom VARCHAR(255),
     telephone VARCHAR(20),
     email VARCHAR(255),
     mdp VARCHAR(255)
   );

   CREATE TABLE sessions (
     id_session INT AUTO_INCREMENT PRIMARY KEY,
     nom_session VARCHAR(255),
     date_session DATE,
     heure_session TIME,
     place_disponible INT
   );

   CREATE TABLE reservations (
     id_reservation INT AUTO_INCREMENT PRIMARY KEY,
     id_session INT,
     id_user INT,
     FOREIGN KEY (id_session) REFERENCES sessions(id_session),
     FOREIGN KEY (id_user) REFERENCES users(id_user)
   );
   ```

5. Create the `.env` file and set the required variables:

   ```
   password=your_mysql_password
   SESSION_SECRET=your_session_secret
   ```

6. Start the application:

   ```
   npm start
   ```

   The application will start running on `http://localhost:3000`.

## Features

### User Registration and Authentication

- Users can sign up by providing their name, email, and password.
- Passwords are hashed using MD5 before being stored in the database.
- Users can log in using their email and password.
- Session management is handled using Express-session.

### Session Management and Authorization

- Authenticated users can access the reservation and profile pages.
- Unauthorized access attempts are logged and the user is redirected to the login page.
- Users can log out of the application.

### Reservation Management

- Authenticated users can view the available sessions and make reservations.
- The number of available places for each session is updated when a reservation is made or cancelled.
- Users can cancel their reservations.

### User Profile Management

- Authenticated users can view and update their profile information (name, email, phone number).

## API Endpoints

1. **Sign Up**:
   - Endpoint: `/SignUp`
   - Method: `POST`
   - Request Body: `{ nom, prenom, telephone, email, password }`

2. **Validate (Login)**:
   - Endpoint: `/Validate`
   - Method: `POST`
   - Request Body: `{ email, password }`

3. **Fetch Sessions**:
   - Endpoint: `/api/sessions`
   - Method: `GET`
   - Authentication: Required

4. **Create Reservation**:
   - Endpoint: `/api/reservations`
   - Method: `POST`
   - Request Body: `{ sessionId }`
   - Authentication: Required

5. **Fetch Reservations**:
   - Endpoint: `/api/reservations`
   - Method: `GET`
   - Authentication: Required

6. **Cancel Reservation**:
   - Endpoint: `/api/reservations/:id`
   - Method: `DELETE`
   - Authentication: Required

7. **Get User Info**:
   - Endpoint: `/getUserInfo`
   - Method: `GET`
   - Authentication: Required

8. **Update User Info**:
   - Endpoint: `/updateUserInfo`
   - Method: `PATCH`
   - Request Body: `{ nom, prenom, telephone, email }`
   - Authentication: Required

9. **Logout**:
   - Endpoint: `/logout`
   - Method: `POST`
   - Authentication: Required

## Contributing

If you find any issues or have suggestions for improvements, feel free to create a new issue or submit a pull request. Contributions are welcome!
