import express from 'express';
import { PORT } from "./config/env.js";
import authRouter from './route/auth.route.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

// todo: auth routes

app.use('/api/v1/auth', authRouter)

// TODO: user routes
// todo: message routes
// todo: error handling
// todo: arcjet middleware
// todo: socket.io
// todo: online-status


app.listen(PORT, () => {
    console.log(`Server is running on port ${(PORT)}`);
})