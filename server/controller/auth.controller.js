import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.create({ name, email, password: hashedPassword })
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if(!user) {
      throw new Error('User not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      throw new Error('Invalid credentials')
    }
    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: '1h'})
    res.cookie('token', token, {httpOnly: true})
    res.status(200).json({message: 'User signed in successfully'})
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie('token', {httpOnly: true})
    res.status(200).json({message: 'User signed out successfully'})
  } catch (error) {
    next(error);
  }
};
