import mysql from "mysql2/promise"; // Ensure correct import syntax

import request from "supertest";
import app from "../index.js";

// test login
test("POST /Validate with valid credentials", async () => {
  const response = await request(app)
    .post("/Validate")
    .send({ email: "nouha@gmail.com", password: "noha123" });

  expect(response.status).toBe(302);
  expect(response.headers["location"]).toBe("/Accueil");
});
