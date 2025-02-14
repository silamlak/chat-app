import { Router } from "express";
import {
  createConversation,
  createMessages,
  getConversations,
  getMessages,
  getNewUsers,
} from "../controller/chat.controller.js";
import authorization from "../middleware/autherization.middleware.js";

const chatRouter = Router();

chatRouter.get("/new-users", authorization, getNewUsers);
chatRouter.get("/conversations", authorization, getConversations);
chatRouter.get("/create-coversation", createConversation);
chatRouter.get("/get-messages/:conversation_id", authorization, getMessages);
chatRouter.post(
  "/create-messages/:conversation_id",
  authorization,
  createMessages
);

export default chatRouter;
