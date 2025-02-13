import express from 'express';
import cors from 'cors';
import { PORT } from "./config/env.js";
import authRouter from './route/auth.route.js';
import errorMiddleware from './middleware/error.middleware.js';
import connectDB from './database/db.connection.js';
import cookieParser from 'cookie-parser';
// import arcjetMiddleware from './middleware/arcjet.middleware.js';
import chatRouter from './route/chat.route.js';
import { app, server } from './socket.js';

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// todo: arcjet middleware
// app.use(arcjetMiddleware);

// todo: auth routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/chat', chatRouter)

// todo: error handling
app.use(errorMiddleware)

// todo: auth
// Auth Done

// TODO: user routes
// todo: message routes
// todo: socket.io
// todo: online-status


server.listen(PORT, async () => {
    console.log(`Server is running on port ${(PORT)}`);
    await connectDB();
})

