import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { User } from "../types/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: Omit<User, "password">;
  }
}

interface JwtPayload {
  id: string;
  email: string;
}

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as jwt.Secret
  ) as JwtPayload;

  const user = await UserModel.findUser(decoded.email);

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.user = user.toSafeObject();
  next();
};
