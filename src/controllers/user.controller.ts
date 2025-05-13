import { Request, Response } from "express";
import UserModel from "../models/user.model";

const registerUser = async (req: Request, res: Response) => {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      redirect_uri: `${process.env.BACKEND_URL}/user/register/callback`,
      response_type: "code",
      scope: "email profile",
    });

  res.redirect(redirectUrl);
};

const registerUserCallback = async (
  req: Request<{}, {}, {}, { code?: string; error?: string }>,
  res: Response
) => {
  const { code, error } = req.query;

  if (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
    return;
  }

  if (!code) {
    res.status(400).json({ message: "Missing Authorization code" });
    return;
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: `${process.env.BACKEND_URL}/user/register/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || "error" in tokenData) {
    res.status(400).json({ message: "Invalid or expired code" });
  }

  const accessToken = tokenData.access_token;

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    }
  );

  const profile = await profileRes.json();

  //checking if user with same email already exists
  let user = await UserModel.findUser(profile.email);

  if (!user) {
    user = await UserModel.createUser({
      name: profile.name,
      email: profile.email,
    });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.redirect(`${process.env.FRONTEND_URL}`);
};

const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
};

const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }
  res.status(201).json({ user: req.user });
};

const UserController = {
  registerUser,
  registerUserCallback,
  logoutUser,
  getProfile,
};

export default UserController;
