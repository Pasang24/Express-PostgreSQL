import { Request, Response } from "express";
import { BaseUser, NewUser } from "../types/user";
import userModel from "../models/user.model";

const registerUser = async (req: Request<{}, {}, NewUser>, res: Response) => {
  const { name, email, password } = req.body;
  const newUser = await userModel.createUser({ name, email, password });
  res.json(newUser);
};

const loginUser = async (req: Request<{}, {}, BaseUser>, res: Response) => {
  const { email, password } = req.body;

  const user = await userModel.findUser(email);

  if (user) {
    res.json(user);
  } else {
    res.json({ message: "User not found" });
  }
};

const userController = { registerUser, loginUser };

export default userController;
