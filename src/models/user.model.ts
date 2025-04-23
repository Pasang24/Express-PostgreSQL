import pool from "../config/db";
import { NewUser, User } from "../types/user";

const createUser = async (user: NewUser): Promise<User> => {
  const { name, email, password } = user;
  const result = await pool.query(
    `INSERT INTO users (name,email,password) VALUES($1,$2,$3) RETURNING *`,
    [name, email, password]
  );

  return result.rows[0];
};

const findUser = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return result.rows[0];
};

const userModel = { createUser, findUser };

export default userModel;
