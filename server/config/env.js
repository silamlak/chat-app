import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, MONGO_URI, JWT_SECRET, ARCJET_ENV, ARCJET_KEY } =
  process.env;
