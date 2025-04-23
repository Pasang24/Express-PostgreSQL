import { Request, Response } from "express";
import { IBaseUser, INewUser } from "../types/user";
import UserModel from "../models/user.model";

const registerUser = async (req: Request<{}, {}, INewUser>, res: Response) => {
  const { name, email, password } = req.body;

  //checking if user with same email already exists
  const userAlreadyExists = await UserModel.findUser(email);

  if (userAlreadyExists) {
    res.status(400).json({ message: "User Already Exists" });
    return;
  }

  const hashedPassword = await UserModel.hashPassword(password);

  const newUser = await UserModel.createUser({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ user: newUser.toSafeObject() });
};

const loginUser = async (req: Request<{}, {}, IBaseUser>, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findUser(email);

  //if email didn't match then return Invalid Email or Password
  if (!user) {
    res.status(400).json({ message: "Invalid Email or Password" });
    return;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(400).json({ message: "Invalid Email or Password" });
    return;
  }

  const token = user.generateAuthToken();

  res.cookie("token", token).status(201).json({ user: user.toSafeObject() });
};

const userController = { registerUser, loginUser };

export default userController;
