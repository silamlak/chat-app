import conversationModel from "../model/conversation.model.js";
import messageModel from "../model/message.model.js";
import User from "../model/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const newConversation = await conversationModel.create(req.body);
    res.status(200).json(newConversation);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { reciever_id } = req.params;
    const conversation = await conversationModel.findOne({
      participants: { $all: [req.user._id, reciever_id] },
    });
    if (!conversation) {
      return res.status(200).json({ messages: [], conversationId: null });
    }

    const messages = await messageModel.find({
      conversationId: conversation._id,
    });
    res.status(200).json({ messages, conversationId: conversation._id });
  } catch (error) {
    next(error);
  }
};

export const createMessages = async (req, res, next) => {
  try {
    let { conversation_id } = req.params;
    const id = req.user._id.toString();
    console.log(conversation_id, id)
    if (conversation_id === "undefined" || conversation_id === "null") {
      const newConversation = await conversationModel.create({
        participants: [id, req.body.reciever],
      });
      conversation_id = newConversation._id?.toString();
    }

    console.log(req.body);

    const message = await messageModel.create({
      ...req.body,
      conversationId: conversation_id,
      sender: id,
    });

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
