import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../model/user.model.js";

const authorization = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = user;
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Unauthorized access: ${error.message}` });
  }
};

export default authorization;