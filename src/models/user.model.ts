import pool from "../config/db";
import jwt from "jsonwebtoken";
import { NewUser, User } from "../types/user";

export default class UserModel implements User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public created_at: Date
  ) {}

  //static method to create a new user
  static async createUser(user: NewUser): Promise<UserModel> {
    const result = await pool.query<User>(
      `INSERT INTO users (name,email) VALUES($1,$2) RETURNING *`,
      [user.name, user.email]
    );

    const { id, name, email, created_at } = result.rows[0];
    const newUser = new UserModel(id, name, email, created_at);
    return newUser;
  }

  //static method to find an existing user
  static async findUser(email: string): Promise<UserModel | null> {
    const result = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      const { id, name, email, created_at } = user;
      const newUser = new UserModel(id, name, email, created_at);
      return newUser;
    }

    return null;
  }

  //method to create a token for session
  generateAuthToken(): string {
    const token = jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET as jwt.Secret
    );

    return token;
  }
}
