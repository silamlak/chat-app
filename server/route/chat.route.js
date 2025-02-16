import { Router } from "express";
import {
  createConversation,
  createMessages,
  getConversations,
  getMessages,
  getNewUsers,
  updateMessageRead,
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
chatRouter.put("/read-messages/:conversation_id/:message_id", authorization, updateMessageRead);

export default chatRouter;
