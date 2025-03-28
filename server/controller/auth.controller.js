import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import User from "../model/user.model.js";
import { JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", refreshToken, { httpOnly: true });
    res
      .status(200)
      .json({ message: "User signed in successfully", accessToken, user });
  } catch (error) {
    next(error);
  }
};
export const signOut = (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token not found");

    }
    console.log({ Token: token, JWT_SECRET });
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }

    console.log("Decoded ID:", decoded.id);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    const newToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Token refreshed successfully", newToken });
  } catch (error) {
    next(error);
  }
};
