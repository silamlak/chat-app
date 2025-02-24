import { Router } from "express";
import {
  refeshToken,
  signIn,
  signOut,
  signUp,
} from "../controller/auth.controller.js";
import authorization from "../middleware/autherization.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", authorization, signOut);

authRouter.post("/refresh", refeshToken);

export default authRouter;
