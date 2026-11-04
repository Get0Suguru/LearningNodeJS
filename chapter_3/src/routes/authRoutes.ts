import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

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

    // 1. create the user
    const storeUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    // 2. create a demo todo for the user
    const demoTodo = await prisma.todo.create({
      data: {
        task: "Demo todo",
        userId: storeUser.id
      }
    });


    // 3. create and send a jwt token to the user for authentication (jwt -> header, payload, signature)
    const token = jwt.sign(
      { userId: storeUser.id },
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
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try{
    const userObj = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    // 1. check if the user exists in the database
    if(!userObj) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. check if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, userObj.password as string);
    if(!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. create and send a jwt token to the user for authentication (jwt -> header, payload, signature)
    const token = jwt.sign(
      { userId: userObj.id },
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
