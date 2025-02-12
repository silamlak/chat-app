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
    const newConversation = await messageModel.find({
      conversationId: conversation._id,
    });
    res.status(200).json(newConversation);
  } catch (error) {
    next(error);
  }
};

export const createMessages = async (req, res, next) => {
  try {
    const { conversation_id } = req.params;
    const message = await messageModel.create({
      ...req.body,
      conversationId: conversation_id,
      sender: req.user._id,
    });
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
