import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/db.js";
import { registerUser } from "../services/authService.js";


export async function register(req, res) {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);

    res.status(201).json(user);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Registration failed",
    });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // STEP 6 — find user
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // verify password
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Login failed",
    });
  }
}