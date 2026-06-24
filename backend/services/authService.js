import bcrypt from "bcrypt";
import db from "../db/db.js";

export async function registerUser(
  email,
  password
) {
  const passwordHash =
    await bcrypt.hash(password, 10);

  const result = await db.query(
    `
    INSERT INTO users (
      email,
      password_hash
    )
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `,
    [email, passwordHash]
  );

  return result.rows[0];
}