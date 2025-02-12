import { Router } from "express";
import { createConversation, createMessages, getMessages, getUsers } from "../controller/chat.controller.js";
import authorization from "../middleware/autherization.middleware.js";

const chatRouter = Router();

chatRouter.get('/users', getUsers)
chatRouter.get("/create-coversation", createConversation);
chatRouter.get("/get-messages/:reciever_id", authorization, getMessages);
chatRouter.post(
  "/create-messages/:conversation_id",
  authorization,
  createMessages
);

export default chatRouter;