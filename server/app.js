import express from 'express';
import { PORT } from "./config/env.js";
import authRouter from './route/auth.route.js';
import errorMiddleware from './middleware/error.middleware.js';
import connectDB from './database/db.connection.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World');
})

// todo: auth routes

app.use('/api/v1/auth', authRouter)

app.use(errorMiddleware)

// TODO: user routes
// todo: message routes
// todo: error handling
// todo: auth
// todo: arcjet middleware
// todo: socket.io
// todo: online-status


app.listen(PORT, async () => {
    console.log(`Server is running on port ${(PORT)}`);
    await connectDB();
})