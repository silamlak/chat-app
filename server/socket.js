import userModel from "./model/user.model.js";

import { Server } from "socket.io";
import http from "http";
import express from "express";
import conversationModel from "./model/conversation.model.js";

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
    console.log("user joined");
    if (userId) {
      await userModel.findByIdAndUpdate(
        userId,
        {
          $set: { socketId: socket.id, isOnline: true, lastSeen: new Date() },
        },
        { new: true }
      );
      const conversations = await conversationModel.find({
        participants: userId,
      });
      if (conversations) {
        const friendIds = conversations?.reduce((acc, conversation) => {
          const friends = conversation.participants.filter(
            (participant) => participant.toString() !== userId
          );
          return acc.concat(friends);
        }, []);
        const users = await Promise.all(
          friendIds.map(async (friendId) => {
            return await userModel.findOne({ _id: friendId }); // Returns a single object
          })
        );

        users?.map((user) => {
          socket.to(user?.socketId).emit("onlineUserRecieve", userId);
        });
      } else {
        console.log("No Conversation Found");
      }
    }
  });

  socket.on("sendMessage", async (data) => {
    console.log(data);
    if (data?.reciever) {
      const user = await userModel.findById(data?.reciever);
      socket.to(user?.socketId).emit("recieveMessage", data);
    }
  });

  socket.on("sendNewConversation", async (data) => {
    const { message, friendId, sender, _id } = data;

    const user = await userModel.findById(friendId);
    const mineProfile = await userModel.findById(sender);

    const sendData = {
      message,
      friend: {
        ...mineProfile?._doc,
      },
      participants: [mineProfile?._id, user?._id],
      _id,
    };
    socket.to(user?.socketId).emit("recieveNewConversation", sendData);
  });

  socket.on("updateMessageRead", async (data) => {
    console.log(data);
    const senderUser = await userModel.findById(data?.sender);
    console.log(senderUser);
    socket.to(senderUser?.socketId).emit("recieveupdateMessageRead", data);
  });

  socket.on("typing", async (data) => {
    console.log(data);
    if (data) {
      const user = await userModel.findById(data?.friendId?._id);
      socket.to(user?.socketId).emit("userTyping", data);
    }
  });

  socket.on("stopTyping", async (data) => {
    console.log(data);
    if (data) {
      const user = await userModel.findById(data?.friendId?._id);
      socket.to(user?.socketId).emit("userStoppedTyping", data);
    }
  });

  socket.on("sendIceCandidate", async (data) => {
    console.log(data);
    if (data) {
      const user = await userModel.findById(data?.to);
      socket.to(user?.socketId).emit("userStoppedTyping", data);
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected", socket.id);

    // Optionally update the user status to offline when disconnected
    const user = await userModel.findOne({ socketId: socket.id });

    let userId;

    if (user) {
      await userModel.findByIdAndUpdate(user._id, {
        $set: { isOnline: false }, // Set user as offline and clear socketId
      });
      console.log(`${user.username} is now offline`);
      userId = user?._id;
    }

    // Optionally, notify other users that this user is offline
    const conversations = await conversationModel.find({
      participants: user?._id,
    });

    const friendIds = conversations.reduce((acc, conversation) => {
      const friends = conversation.participants.filter(
        (participant) => participant.toString() !== user?._id.toString()
      );
      return acc.concat(friends);
    }, []);

    const users = await Promise.all(
      friendIds.map(async (friendId) => {
        return await userModel.findOne({ _id: friendId });
      })
    );

    users?.forEach((user) => {
      if (user?.socketId) {
        socket.to(user.socketId).emit("offlineUserRecieve", userId);
      }
    });
  });
});

export { io, app, server };
