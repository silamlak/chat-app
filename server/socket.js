import userModel from "./model/user.model.js";

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = new http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);
  socket.on("join", async (userId) => {
    if (userId) {
      const user = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: { socketId: socket.id },
        },
        { new: true }
      );
      // console.log(user);
    }
  });

  socket.on('sendMessage', async (data) => {
    console.log(data)
    if (data?.reciever) {
      const user = await userModel.findById(data?.reciever);
      socket.to(user?.socketId).emit("recieveMessage", data);
    }
  })

  socket.on("disconnected", () => {
    console.log("user Disconnected", socket.id);
  });
});

export { io, app, server };
