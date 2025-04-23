import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NewUser, User } from "../types/user";

export default class UserModel implements User {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public password: string,
    public created_at: Date
  ) {}

  //static method to create a new user
  static async createUser(user: NewUser): Promise<UserModel> {
    const result = await pool.query<User>(
      `INSERT INTO users (name,email,password) VALUES($1,$2,$3) RETURNING *`,
      [user.name, user.email, user.password]
    );

    const { id, name, email, password, created_at } = result.rows[0];
    const newUser = new UserModel(id, name, email, password, created_at);
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
      const { id, name, email, password, created_at } = user;
      const newUser = new UserModel(id, name, email, password, created_at);
      return newUser;
    }

    return null;
  }

  //static method to hash password
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  //method to compare user password with input password
  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  //method to create a token for session
  generateAuthToken(): string {
    const token = jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET as jwt.Secret
    );

    return token;
  }

  // method to return the user without the hashed password
  toSafeObject(): Omit<User, "password"> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
    };
  }
}
