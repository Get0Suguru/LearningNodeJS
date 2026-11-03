import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../db.js";

const router = express.Router();

// register endpoint
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // store username and hashedPassword in database
  try {

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // 1. store the user in the database
    const statement = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
    );
    const result = statement.run(username, hashedPassword);

    // 2. now we want to make a demo default todo for the user after registration
    const statement2 = db.prepare(
      `INSERT INTO todos (task, user_id) VALUES (?, ?)`,
    );
    statement2.run("Demo todo", result.lastInsertRowid);

    // 3. create and send a jwt token to the user for authentication (jwt -> header, payload, signature)
    const token = jwt.sign(
      { userId: result.lastInsertRowid },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
    
    
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log("unknown error occurred while registering user");
    res.status(500).json({ message: "Internal server error" });
  }
});

// login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try{
    // 1. check if the user exists in the database
    const statement = db.prepare(
      `SELECT id, password FROM users WHERE username = ?`,
    );
    const user = statement.get(username);

    if(!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. check if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password as string);
    if(!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. create and send a jwt token to the user for authentication (jwt -> header, payload, signature)
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );
    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else console.log("unknown error occurred while logging in user");
    res.status(500).json(
      { message: "Internal server error" }
    )
  }
});

export default router;
